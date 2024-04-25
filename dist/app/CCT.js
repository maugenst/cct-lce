"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCT = void 0;
const uuid_1 = require("uuid");
const node_fetch_1 = require("node-fetch");
const events_1 = require("events");
const socket_io_client_1 = require("socket.io-client");
const abort_controller_1 = require("abort-controller");
const Datacenter_1 = require("../@types/Datacenter");
const LCE_1 = require("./LCE");
const Util_1 = require("./Util");
const defaultSocketConfig = {
    reconnection: false,
    timeout: 5000,
};
class CCT extends events_1.EventEmitter {
    constructor() {
        super();
        this.allDatacenters = [];
        this.datacenters = [];
        this.runningLatency = false;
        this.runningBandwidth = false;
        this.idsToExclude = [];
        this.compatibleDCsWithSockets = [];
        this.lce = new LCE_1.LCE();
        this.abortControllers = [];
        this.sockets = {
            latency: null,
            bandwidth: null,
        };
        this.measurementConfigs = {
            latency: {
                type: 'latency',
                socketStartEvent: "latency:start",
                socketEndEvent: "latency:end",
                socketIterationEvent: "latency:iteration",
                socketTickEvent: "latency",
                iterationEvent: "latency:iteration",
                tickEvent: "latency",
                endEvent: "latency:end",
                getMeasurementResult: (dc) => this.lce.getLatencyFor(dc),
            },
            bandwidth: {
                type: 'bandwidth',
                socketStartEvent: "bandwidth:start",
                socketEndEvent: "bandwidth:end",
                socketIterationEvent: "bandwidth:iteration",
                socketTickEvent: "bandwidth",
                iterationEvent: "bandwidth:iteration",
                tickEvent: "bandwidth",
                endEvent: "bandwidth:end",
                getMeasurementResult: (dc, params) => this.lce.getBandwidthFor(dc, params.bandwidthMode),
            },
        };
    }
    async fetchDatacenterInformation(dictionaryUrl = 'https://cct.demo-education.cloud.sap/datacenters?isActive=true') {
        try {
            const response = await (0, node_fetch_1.default)(dictionaryUrl);
            const datacenters = await response.json();
            this.allDatacenters = datacenters;
            this.datacenters = datacenters;
            this.clean();
        }
        catch (e) {
            this.allDatacenters = [];
            this.datacenters = [];
        }
    }
    async fetchCompatibleDCsWithSockets() {
        const checks = await Promise.all(this.datacenters.map(async (dc) => ({
            dc,
            isCompatible: await this.lce.checkIfCompatibleWithSockets(dc.ip),
        })));
        this.compatibleDCsWithSockets = checks.filter(({ isCompatible }) => isCompatible).map(({ dc }) => dc);
        return this.compatibleDCsWithSockets;
    }
    setFilters(filters) {
        this.datacenters = filters
            ? this.allDatacenters.filter((dc) => {
                if (this.idsToExclude.includes(dc.id)) {
                    return false;
                }
                return Object.keys(filters).every((key) => {
                    if (key === 'tags') {
                        return filters[key].some((tag) => {
                            return dc[key].toLowerCase().includes(tag.toLowerCase());
                        });
                    }
                    return filters[key].map((filterVal) => filterVal.toLowerCase()).includes(dc[key].toLowerCase());
                });
            })
            : this.allDatacenters.filter((dc) => !this.idsToExclude.includes(dc.id));
        this.filters = filters;
    }
    stopMeasurements() {
        this.runningLatency = false;
        this.runningBandwidth = false;
        this.abortControllers.forEach((o) => {
            o.abort();
        });
        this.abortControllers = [];
        this.lce.terminate();
        this.emit("latency:end");
        this.emit("bandwidth:end");
    }
    async startLatencyChecks(params = {}) {
        if (!this.compatibleDCsWithSockets.some((el) => el.id === params.from) && params.from !== undefined) {
            return;
        }
        if (params.from !== this.lastLatencyFrom) {
            this.cleanLatencyData();
            this.lastLatencyFrom = params.from;
        }
        const { iterations = 16, save = true } = params;
        await this.startMeasurements('latency', { ...params, iterations, save }, new abort_controller_1.default());
    }
    async startBandwidthChecks(params = {}) {
        if (!this.compatibleDCsWithSockets.some((el) => el.id === params.from) && params.from !== undefined) {
            return;
        }
        if (params.from !== this.lastBandwidthFrom) {
            this.cleanBandwidthData();
            this.lastBandwidthFrom = params.from;
        }
        const { iterations = 4, save = true } = params;
        await this.startMeasurements('bandwidth', { ...params, iterations, save }, new abort_controller_1.default());
    }
    async startMeasurements(type, params, abortController) {
        const config = this.measurementConfigs[type];
        const stateProperty = type === 'latency' ? 'runningLatency' : 'runningBandwidth';
        this[stateProperty] = true;
        this.abortControllers.push(abortController);
        const dc = params.from && this.compatibleDCsWithSockets.find((dc) => dc.id === params.from);
        if (dc) {
            await this.startCloudMeasurements(config, params, dc, abortController);
        }
        else if (this.datacenters.length !== 0) {
            await this.startLocalMeasurements(config, params, abortController);
        }
        if (!abortController.signal.aborted) {
            this[stateProperty] = false;
            this.emit(config.endEvent);
        }
    }
    setIdToExclude(ids) {
        this.idsToExclude = ids || [];
        this.setFilters(this.filters);
    }
    clearSocket(type) {
        const socket = this.sockets[type];
        if (!socket)
            return;
        socket.emit("stop");
        socket.removeAllListeners();
        this.sockets[type] = null;
    }
    async startCloudMeasurements(config, params, dc, abortController) {
        return new Promise((resolve) => {
            const resolveAndClear = () => {
                this.clearSocket(config.type);
                resolve();
            };
            abortController.signal.addEventListener('abort', resolveAndClear);
            const socket = (0, socket_io_client_1.io)(`https://${dc.ip}`, { ...defaultSocketConfig, query: { id: dc.id } });
            this.sockets[config.type] = socket;
            const events = [config.socketEndEvent, "disconnect", "connect_error"];
            events.forEach((event) => socket.on(event, resolveAndClear));
            socket.on("connect", () => {
                socket.emit(config.socketStartEvent, {
                    ...params,
                    id: dc.id,
                    filters: this.filters,
                });
            });
            socket.on(config.socketIterationEvent, (data) => {
                this.emit(config.iterationEvent, data);
            });
            socket.on(config.socketTickEvent, (data) => {
                this.handleEventData(data, params.save, config.type);
                this.emit(config.tickEvent, data);
            });
        });
    }
    async startLocalMeasurements(config, params, abortController) {
        let iterations = params.iterations;
        while (iterations-- > 0) {
            if (abortController.signal.aborted)
                return;
            const eventData = (await Promise.all(this.datacenters.map((dc) => this.startMeasurementFor(config, dc, params, abortController)))).filter((entry) => entry !== null);
            if (!abortController.signal.aborted) {
                this.emit(config.iterationEvent, eventData);
            }
            else {
                return;
            }
            if (params.interval) {
                await Util_1.Util.sleep(params.interval, abortController);
            }
        }
    }
    async startMeasurementFor(config, dc, params, abortController) {
        const result = await config.getMeasurementResult(dc, params);
        if (abortController.signal.aborted || result === null)
            return null;
        const data = { id: dc.id, data: result };
        this.handleEventData(data, params.save, config.type);
        this.emit(config.tickEvent, data);
        return data;
    }
    handleEventData({ id, data }, save, dataType) {
        if (!save)
            return;
        const dcIndex = this.datacenters.findIndex((e) => e.id === id);
        if (dcIndex < 0)
            return;
        const dc = this.datacenters[dcIndex];
        if (dataType === 'latency') {
            dc.latencies = dc.latencies || [];
            dc.latencies.push(data);
            const averageLatency = Util_1.Util.getAverageLatency(dc.latencies);
            dc.averageLatency = averageLatency;
            dc.latencyJudgement = Util_1.Util.judgeLatency(averageLatency);
        }
        else if (dataType === 'bandwidth') {
            dc.bandwidths = dc.bandwidths || [];
            dc.bandwidths.push(data);
            const averageBandwidth = Util_1.Util.getAverageBandwidth(dc.bandwidths);
            dc.averageBandwidth = averageBandwidth;
            dc.bandwidthJudgement = Util_1.Util.judgeBandwidth(averageBandwidth);
        }
    }
    getCurrentDatacentersSorted() {
        Util_1.Util.sortDatacenters(this.datacenters);
        return this.datacenters;
    }
    async getAddress() {
        const location = {
            address: '',
            latitude: 0,
            longitude: 0,
        };
        return new Promise((resolve) => {
            if (navigator && (navigator === null || navigator === void 0 ? void 0 : navigator.geolocation)) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    location.latitude = position.coords.latitude;
                    location.longitude = position.coords.longitude;
                    const geocoder = new google.maps.Geocoder();
                    await geocoder.geocode({
                        location: new google.maps.LatLng(location.latitude, location.longitude),
                    }, (results, status) => {
                        if (status === 'OK') {
                            location.address = results[0].formatted_address;
                            resolve(location);
                        }
                        else {
                            location.address = '';
                            location.latitude = 0;
                            location.longitude = 0;
                            resolve(location);
                        }
                    });
                }, () => {
                    resolve(null);
                });
            }
            else {
                resolve(null);
            }
        });
    }
    async store(location, url = 'https://cct.demo-education.cloud.sap/measurement') {
        if (!location)
            return false;
        const minimumLatencyThresholdToSave = 16;
        const minimumBandwidthThresholdToCalculateAverage = 4;
        const data = [];
        this.datacenters.forEach((dc, index) => {
            const newLatencyMeasurementsCount = dc.latencies.length - (dc.storedLatencyCount || 0);
            if (newLatencyMeasurementsCount >= minimumLatencyThresholdToSave) {
                const newAverageLatency = Util_1.Util.getAverageLatency(dc.latencies, dc.storedLatencyCount);
                const isNewAverageBandwidthCalculable = this.lastBandwidthFrom === this.lastLatencyFrom &&
                    dc.bandwidths.length - (dc.storedBandwidthCount || 0) >=
                        minimumBandwidthThresholdToCalculateAverage;
                const newAverageBandwidth = isNewAverageBandwidthCalculable
                    ? Util_1.Util.getAverageBandwidth(dc.bandwidths, dc.storedBandwidthCount)
                    : null;
                data.push({
                    id: dc.id,
                    latency: newAverageLatency.toFixed(2),
                    averageBandwidth: newAverageBandwidth && newAverageBandwidth.megaBitsPerSecond.toFixed(2),
                });
                this.datacenters[index].storedLatencyCount = dc.latencies.length;
                this.datacenters[index].storedBandwidthCount = isNewAverageBandwidthCalculable
                    ? dc.bandwidths.length
                    : this.datacenters[index].storedBandwidthCount;
            }
        });
        if (data.length === 0) {
            return false;
        }
        const payload = {
            uid: (0, uuid_1.v4)(),
            source_id: this.lastLatencyFrom,
            ...location,
            data,
        };
        const body = JSON.stringify(payload, null, 4);
        try {
            const result = await (0, node_fetch_1.default)(url, {
                method: 'post',
                body: body,
                headers: { 'Content-Type': 'application/json' },
            });
            const json = await result.json();
            return json.status === 'OK';
        }
        catch (error) {
            return false;
        }
    }
    clean() {
        this.cleanBandwidthData();
        this.cleanLatencyData();
    }
    cleanLatencyData() {
        this.datacenters.forEach((dc) => {
            dc.position = 0;
            dc.averageLatency = 0;
            dc.latencies = [];
            dc.latencyJudgement = Datacenter_1.Speed.nothing;
            dc.storedLatencyCount = 0;
        });
    }
    cleanBandwidthData() {
        this.datacenters.forEach((dc) => {
            dc.averageBandwidth = {
                bitsPerSecond: 0,
                kiloBitsPerSecond: 0,
                megaBitsPerSecond: 0,
            };
            dc.bandwidths = [];
            dc.bandwidthJudgement = Datacenter_1.Speed.nothing;
            dc.storedBandwidthCount = 0;
        });
    }
    async getClosestDatacenters({ latitude, longitude, top = 1, url = 'https://cct.demo-education.cloud.sap/datacenters?isActive=true', }) {
        if (!this.allDatacenters || !this.allDatacenters.length) {
            await this.fetchDatacenterInformation(url);
        }
        const datacentersWithDistances = this.allDatacenters.map((datacenter) => {
            const distance = Util_1.Util.calculateDistance(latitude, longitude, +datacenter.latitude, +datacenter.longitude);
            return { datacenter, distance };
        });
        datacentersWithDistances.sort((a, b) => a.distance - b.distance);
        const validTop = Math.min(top, this.allDatacenters.length);
        const topDatacenters = datacentersWithDistances.slice(0, validTop);
        return topDatacenters.map((entry) => entry.datacenter);
    }
}
exports.CCT = CCT;
//# sourceMappingURL=CCT.js.map