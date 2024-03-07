"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCT = void 0;
const uuid_1 = require("uuid");
const node_fetch_1 = require("node-fetch");
const LCE_1 = require("./LCE");
const Util_1 = require("./Util");
const events_1 = require("events");
const socket_io_client_1 = require("socket.io-client");
const abort_controller_1 = require("abort-controller");
const localStorageName = 'CCT_DATA';
const defaultSocketConfig = {
    reconnectionAttempts: 3,
    timeout: 10000,
};
class CCT extends events_1.EventEmitter {
    constructor() {
        super();
        this.allDatacenters = [];
        this.datacenters = [];
        this.runningLatency = false;
        this.runningBandwidth = false;
        this.idToExclude = null;
        this.compatibleDCsWithSockets = [];
        this.latencySocket = null;
        this.bandwidthSocket = null;
        this.storage = [];
        this.lce = new LCE_1.LCE();
        this.abortControllers = [];
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
                getMeasurementResult: this.lce.getLatencyFor.bind(this.lce),
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
    async fetchDatacenterInformationRequest(dictionaryUrl) {
        try {
            return (await (0, node_fetch_1.default)(dictionaryUrl).then((res) => res.json()));
        }
        catch (e) {
            return [];
        }
    }
    async fetchDatacenterInformation(dictionaryUrl) {
        this.allDatacenters = await this.fetchDatacenterInformationRequest(dictionaryUrl);
        this.datacenters = this.allDatacenters;
        this.storage = this.allDatacenters.map((dc) => {
            return {
                id: dc.id,
                latencies: [],
                bandwidths: [],
                shouldSave: false,
            };
        });
        this.clean();
        this.readLocalStorage();
    }
    async fetchCompatibleDCsWithSockets() {
        const result = await Promise.all(this.datacenters.map(async (dc) => {
            const isCompatible = await this.lce.checkIfCompatibleWithSockets(dc.ip);
            return isCompatible ? dc : null;
        }));
        this.compatibleDCsWithSockets = result.filter((dc) => dc !== null);
        return this.compatibleDCsWithSockets;
    }
    setIdToExclude(id) {
        this.idToExclude = id;
        this.setFilters(this.filters);
    }
    setFilters(filters) {
        this.datacenters = filters
            ? this.allDatacenters.filter((dc) => {
                if (dc.id === this.idToExclude) {
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
            : this.allDatacenters.filter((dc) => dc.id !== this.idToExclude);
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
        params = {
            iterations: params.iterations || 16,
            saveToLocalStorage: typeof params.saveToLocalStorage === 'undefined' ? false : params.saveToLocalStorage,
            save: typeof params.save === 'undefined' ? true : params.save,
            ...params,
        };
        await this.startMeasurements('latency', params, new abort_controller_1.default());
    }
    async startBandwidthChecks(params = {}) {
        params = {
            iterations: params.iterations || 4,
            saveToLocalStorage: typeof params.saveToLocalStorage === 'undefined' ? false : params.saveToLocalStorage,
            save: typeof params.save === 'undefined' ? true : params.save,
            ...params,
        };
        await this.startMeasurements('bandwidth', params, new abort_controller_1.default());
    }
    async startMeasurements(type, params, abortController) {
        const config = this.measurementConfigs[type];
        const stateProperty = type === 'latency' ? 'runningLatency' : 'runningBandwidth';
        this[stateProperty] = true;
        this.abortControllers.push(abortController);
        const dc = params.from && this.allDatacenters.find((dc) => dc.id === params.from);
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
    clearSocket(type) {
        let socket = type === 'latency' ? this.latencySocket : this.bandwidthSocket;
        if (!socket)
            return;
        socket.emit("socket:disconnect");
        socket.removeAllListeners();
        socket = null;
        if (type === 'latency') {
            this.latencySocket = null;
        }
        else if (type === 'bandwidth') {
            this.bandwidthSocket = null;
        }
    }
    async startCloudMeasurements(config, params, dc, abortController) {
        if (Util_1.Util.isBackEnd())
            return;
        return new Promise((resolve) => {
            const resolveAndClear = () => {
                this.clearSocket(config.type);
                resolve();
            };
            abortController.signal.addEventListener('abort', resolveAndClear);
            const socket = (0, socket_io_client_1.io)('ws://localhost', { ...defaultSocketConfig, query: { id: dc.id } });
            this[`${config.type}Socket`] = socket;
            const events = [config.socketEndEvent, "socket:disconnect", "socket:connect_error"];
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
                if (config.type === 'latency') {
                    this.handleLatency(data, params.save, params.saveToLocalStorage);
                }
                else {
                    this.handleBandwidth(data, params.save, params.saveToLocalStorage);
                }
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
        console.log('result is here', config.type);
        if (abortController.signal.aborted || result === null)
            return null;
        console.log('result is being handled by data handler', config.type);
        const data = { id: dc.id, data: result };
        if (config.type === 'latency') {
            this.handleLatency(data, params.save, params.saveToLocalStorage);
        }
        else {
            this.handleBandwidth(data, params.save, params.saveToLocalStorage);
        }
        this.emit(config.tickEvent, data);
        return result;
    }
    handleLatency({ id, data }, save, saveToLocalStorage) {
        console.log('handle latency', data, save, saveToLocalStorage);
        if (!save)
            return;
        const dcIndex = this.datacenters.findIndex((e) => e.id === id);
        console.log(dcIndex, this.datacenters, data);
        if (dcIndex < 0)
            return;
        const dc = this.datacenters[dcIndex];
        dc.latencies = dc.latencies || [];
        dc.latencies.push(data);
        const averageLatency = Util_1.Util.getAverageLatency(dc.latencies);
        dc.averageLatency = averageLatency;
        dc.latencyJudgement = Util_1.Util.judgeLatency(averageLatency);
        this.addDataToStorage(dc.id, data);
        if (saveToLocalStorage)
            this.setLocalStorage();
    }
    handleBandwidth({ id, data }, save, saveToLocalStorage) {
        console.log('handle bandwidth', data, save, saveToLocalStorage);
        if (!save)
            return;
        const dcIndex = this.datacenters.findIndex((dc) => dc.id === id);
        if (dcIndex < 0)
            return;
        const dc = this.datacenters[dcIndex];
        dc.bandwidths = dc.bandwidths || [];
        dc.bandwidths.push(data);
        const averageBandwidth = Util_1.Util.getAverageBandwidth(dc.bandwidths);
        dc.averageBandwidth = averageBandwidth;
        dc.bandwidthJudgement = Util_1.Util.judgeBandwidth(averageBandwidth);
        this.addDataToStorage(dc.id, data);
        if (saveToLocalStorage)
            this.setLocalStorage();
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
                    resolve(location);
                });
            }
            else {
                resolve(location);
            }
        });
    }
    async storeRequest(body) {
        return await (0, node_fetch_1.default)('https://cct.demo-education.cloud.sap/measurement', {
            method: 'post',
            body: body,
            headers: { 'Content-Type': 'application/json' },
        }).then((res) => res.json());
    }
    async store(location = {
        address: 'Dietmar-Hopp-Allee 16, 69190 Walldorf, Germany',
        latitude: 49.2933756,
        longitude: 8.6421212,
    }) {
        const data = [];
        this.storage = this.storage.map((item) => {
            var _a;
            if (item.shouldSave) {
                data.push({
                    id: item.id,
                    latency: `${(_a = Util_1.Util.getAverageLatency(item.latencies)) === null || _a === void 0 ? void 0 : _a.toFixed(2)}`,
                    averageBandwidth: Util_1.Util.getAverageBandwidth(item.bandwidths).megaBitsPerSecond.toFixed(2),
                });
                return {
                    id: item.id,
                    latencies: [],
                    bandwidths: [],
                    shouldSave: false,
                };
            }
            return item;
        });
        const body = JSON.stringify({
            uid: (0, uuid_1.v4)(),
            address: location.address,
            latitude: location.latitude,
            longitude: location.longitude,
            data,
        }, null, 4);
        try {
            const result = await this.storeRequest(body);
            return result.status === 'OK';
        }
        catch (error) {
            return false;
        }
    }
    addDataToStorage(id, data) {
        this.storage = this.storage.map((item) => {
            if (item.id === id) {
                const isLatencyData = 'value' in data && typeof data.value === 'number';
                const latencies = isLatencyData ? [...item.latencies, data] : item.latencies;
                const bandwidths = isLatencyData ? item.bandwidths : [...item.bandwidths, data];
                return {
                    id: item.id,
                    latencies,
                    bandwidths,
                    shouldSave: latencies.length >= 16,
                };
            }
            return item;
        });
    }
    setLocalStorage() {
        if (Util_1.Util.isBackEnd()) {
            return;
        }
        window.localStorage.removeItem(localStorageName);
        const data = this.allDatacenters.map((dc) => {
            return {
                id: dc.id,
                latencies: dc.latencies,
                averageLatency: dc.averageLatency,
                latencyJudgement: dc.latencyJudgement,
                bandwidths: dc.bandwidths,
                averageBandwidth: dc.averageBandwidth,
                bandwidthJudgement: dc.bandwidthJudgement,
            };
        });
        window.localStorage.setItem(localStorageName, JSON.stringify(data));
    }
    readLocalStorage() {
        if (Util_1.Util.isBackEnd()) {
            return;
        }
        const data = window.localStorage.getItem(localStorageName);
        if (!data) {
            return;
        }
        const parsedData = JSON.parse(data);
        this.allDatacenters = this.allDatacenters.map((dc) => {
            const foundItem = parsedData.find((item) => item.id === dc.id);
            if (foundItem) {
                return {
                    ...dc,
                    averageLatency: foundItem.averageLatency,
                    latencyJudgement: foundItem.latencyJudgement,
                    averageBandwidth: foundItem.averageBandwidth,
                    bandwidthJudgement: foundItem.bandwidthJudgement,
                    latencies: foundItem.latencies,
                    bandwidths: foundItem.bandwidths,
                };
            }
            return dc;
        });
        window.localStorage.removeItem(localStorageName);
    }
    subscribe(event, callback) {
        this.on(event, callback);
    }
    unsubscribe(event, callback) {
        this.off(event, callback);
    }
    clean() {
        this.datacenters.forEach((dc) => {
            dc.position = 0;
            dc.averageLatency = 0;
            dc.averageBandwidth = {
                bitsPerSecond: 0,
                kiloBitsPerSecond: 0,
                megaBitsPerSecond: 0,
            };
            dc.latencies = [];
            dc.bandwidths = [];
        });
    }
}
exports.CCT = CCT;
//# sourceMappingURL=CCT.js.map