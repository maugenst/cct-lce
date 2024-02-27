"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCT = void 0;
const uuid_1 = require("uuid");
const node_fetch_1 = require("node-fetch");
const Datacenter_1 = require("../@types/Datacenter");
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
        this.compatibleDCsWithSockets = [];
        this.latencySocket = null;
        this.bandwidthSocket = null;
        this.storage = [];
        this.lce = new LCE_1.LCE();
        this.abortController = [];
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
    setFilters(filters) {
        this.datacenters = filters
            ? this.allDatacenters.filter((dc) => Object.keys(filters).every((key) => {
                if (key === 'tags') {
                    return filters[key].some((tag) => {
                        return dc[key].toLowerCase().includes(tag.toLowerCase());
                    });
                }
                return filters[key].map((filterVal) => filterVal.toLowerCase()).includes(dc[key].toLowerCase());
            }))
            : this.allDatacenters;
        this.filters = filters;
    }
    async startCloudLatencyMeasurements({ iterations, interval, save, saveToLocalStorage }, dc, abortController) {
        if (Util_1.Util.isBackEnd()) {
            return;
        }
        return new Promise((resolve) => {
            abortController.signal.addEventListener('abort', () => {
                if (this.latencySocket) {
                    this.latencySocket.emit("socket:disconnect");
                    this.latencySocket.removeAllListeners();
                    this.latencySocket = null;
                    console.log('abortedCloudLatencyMeasurements');
                }
                resolve();
            });
            const uri = `wss://${dc.ip}`;
            console.log('uri', uri);
            this.latencySocket = (0, socket_io_client_1.io)('ws://localhost', { ...defaultSocketConfig, query: { id: dc.id } });
            this.latencySocket.on('connect', () => {
                var _a;
                (_a = this.latencySocket) === null || _a === void 0 ? void 0 : _a.emit("latency:start", {
                    id: dc.id,
                    filters: this.filters,
                    iterations,
                    interval,
                });
            });
            this.latencySocket.on("latency:end", () => {
                if (this.latencySocket) {
                    this.latencySocket.emit("socket:disconnect");
                    this.latencySocket.removeAllListeners();
                    this.latencySocket = null;
                }
                resolve();
            });
            this.latencySocket.on("socket:disconnect", () => {
                if (this.latencySocket) {
                    this.latencySocket.emit("socket:disconnect");
                    this.latencySocket.removeAllListeners();
                    this.latencySocket = null;
                }
                resolve();
            });
            this.latencySocket.on('connect_error', () => {
                if (this.latencySocket) {
                    this.latencySocket.emit("socket:disconnect");
                    this.latencySocket.removeAllListeners();
                    this.latencySocket = null;
                }
                resolve();
            });
            this.latencySocket.on("latency", (latencyEventData) => {
                this.handleLatency(latencyEventData, save, saveToLocalStorage);
                this.emit("latency", latencyEventData);
            });
            this.latencySocket.on("latency:iteration", (latencyEventData) => {
                this.emit("latency:iteration", latencyEventData);
            });
        });
    }
    stopMeasurements() {
        this.runningLatency = false;
        this.runningBandwidth = false;
        this.abortController.forEach((o) => {
            o.abort();
        });
        this.abortController = [];
        this.lce.terminate();
    }
    async startLatencyChecks(parameters = {}) {
        console.log('startedCloudLatencyMeasurements');
        this.runningLatency = true;
        const abortController = new abort_controller_1.default();
        this.abortController.push(abortController);
        if (parameters.from) {
            const dc = this.allDatacenters.find((dc) => dc.id === parameters.from);
            if (dc) {
                await this.startCloudLatencyMeasurements(parameters, dc, abortController);
            }
        }
        else {
            await this.startLocalLatencyMeasurements(parameters, abortController);
        }
        this.runningLatency = false;
        console.log('before emit endedCloudLatencyMeasurements');
        this.emit("latency:end");
        console.log('after emit endedCloudLatencyMeasurements');
    }
    async startLocalLatencyMeasurements({ iterations = 16, interval, save, saveToLocalStorage }, abortController) {
        while (iterations > 0) {
            if (abortController.signal.aborted) {
                return;
            }
            const latencyIterationEventData = await Promise.all(this.datacenters.map((dc) => this.startMeasurementForLatency(dc, abortController, save, saveToLocalStorage)));
            if (abortController.signal.aborted) {
                const filteredEventData = latencyIterationEventData.filter((entry) => entry !== null);
                if (filteredEventData.length) {
                    this.emit("latency:iteration", filteredEventData);
                }
                return;
            }
            else {
                this.emit("latency:iteration", latencyIterationEventData);
            }
            iterations--;
            if (interval) {
                await Util_1.Util.sleep(interval, abortController);
            }
        }
    }
    async startMeasurementForLatency(dc, abortController, save, saveToLocalStorage) {
        const latency = await this.lce.getLatencyFor(dc);
        if (abortController.signal.aborted) {
            return null;
        }
        const latencyEventData = { id: dc.id, latency };
        this.handleLatency(latencyEventData, save, saveToLocalStorage);
        this.emit("latency", latencyEventData);
        return latencyEventData;
    }
    handleLatency(data, save = true, saveToLocalStorage = false) {
        var _a;
        if (save) {
            const index = this.datacenters.findIndex((e) => e.id === data.id);
            (_a = this.datacenters[index].latencies) === null || _a === void 0 ? void 0 : _a.push(data.latency);
            const averageLatency = Util_1.Util.getAverageLatency(this.datacenters[index].latencies);
            this.datacenters[index].averageLatency = averageLatency;
            this.datacenters[index].latencyJudgement = this.judgeLatency(averageLatency);
            this.addDataToStorage(this.datacenters[index].id, data.latency);
            if (saveToLocalStorage) {
                this.setLocalStorage();
            }
        }
    }
    async startBandwidthChecks(parameters = {}) {
        this.runningBandwidth = true;
        if (parameters.from) {
            const dc = this.allDatacenters.find((dc) => dc.id === parameters.from);
            if (dc) {
                await this.startCloudBandwidthMeasurements(parameters, dc);
            }
            if (this.bandwidthSocket) {
                this.bandwidthSocket.emit("socket:disconnect");
                this.bandwidthSocket.removeAllListeners();
                this.bandwidthSocket = null;
            }
        }
        else {
            const abortController = new abort_controller_1.default();
            this.abortController.push(abortController);
            await this.startLocalBandwidthMeasurements(parameters, abortController);
        }
        this.runningBandwidth = false;
        this.emit("bandwidth:end");
    }
    async startCloudBandwidthMeasurements({ iterations, interval, save, saveToLocalStorage, bandwidthMode }, dc) {
        if (Util_1.Util.isBackEnd()) {
            return;
        }
        return new Promise((resolve) => {
            this.bandwidthSocket = (0, socket_io_client_1.io)('ws://localhost', { ...defaultSocketConfig, query: { id: dc.id } });
            this.bandwidthSocket.on('connect', () => {
                var _a;
                return (_a = this.bandwidthSocket) === null || _a === void 0 ? void 0 : _a.emit("bandwidth:start", {
                    id: dc.id,
                    filters: this.filters,
                    iterations,
                    interval,
                    bandwidthMode,
                });
            });
            this.bandwidthSocket.on("bandwidth:end", () => {
                resolve();
            });
            this.bandwidthSocket.on("socket:disconnect", () => {
                resolve();
            });
            this.bandwidthSocket.on('connect_error', () => {
                resolve();
            });
            this.bandwidthSocket.on("bandwidth", (bandwidthEventData) => {
                this.handleBandwidth(bandwidthEventData, save, saveToLocalStorage);
                this.emit("bandwidth", bandwidthEventData);
            });
            this.bandwidthSocket.on("bandwidth:iteration", (latencyEventData) => {
                this.emit("bandwidth:iteration", latencyEventData);
            });
        });
    }
    async startLocalBandwidthMeasurements({ iterations = 4, interval, save, saveToLocalStorage, bandwidthMode }, abortController) {
        while (iterations > 0) {
            if (abortController.signal.aborted) {
                return;
            }
            const bandwidthIterationEventData = await Promise.all(this.datacenters.map((dc) => this.startMeasurementForBandwidth(dc, abortController, save, saveToLocalStorage, bandwidthMode)));
            if (abortController.signal.aborted) {
                const filteredEventData = bandwidthIterationEventData.filter((entry) => entry !== null);
                if (filteredEventData.length) {
                    this.emit("bandwidth:iteration", filteredEventData);
                }
                return;
            }
            else {
                this.emit("bandwidth:iteration", bandwidthIterationEventData);
            }
            iterations--;
            if (interval) {
                await Util_1.Util.sleep(interval, abortController);
            }
        }
    }
    async startMeasurementForBandwidth(dc, abortController, save, saveToLocalStorage, bandwidthMode) {
        const bandwidth = await this.lce.getBandwidthFor(dc, bandwidthMode);
        if (!bandwidth || abortController.signal.aborted) {
            return null;
        }
        const bandwidthEventData = { id: dc.id, bandwidth };
        this.handleBandwidth(bandwidthEventData, save, saveToLocalStorage);
        this.emit("bandwidth", bandwidthEventData);
        return bandwidthEventData;
    }
    handleBandwidth(data, save = true, saveToLocalStorage = false) {
        var _a;
        if (save) {
            const index = this.datacenters.findIndex((e) => e.id === data.id);
            (_a = this.datacenters[index].bandwidths) === null || _a === void 0 ? void 0 : _a.push(data.bandwidth);
            const averageBandwidth = Util_1.Util.getAverageBandwidth(this.datacenters[index].bandwidths);
            this.datacenters[index].averageBandwidth = averageBandwidth;
            this.datacenters[index].bandwidthJudgement = this.judgeBandwidth(averageBandwidth);
            this.addDataToStorage(data.id, data.bandwidth);
            if (saveToLocalStorage) {
                this.setLocalStorage();
            }
        }
    }
    judgeLatency(averageLatency) {
        if (averageLatency < 170) {
            return Datacenter_1.Speed.good;
        }
        else if (averageLatency >= 170 && averageLatency < 280) {
            return Datacenter_1.Speed.ok;
        }
        else {
            return Datacenter_1.Speed.bad;
        }
    }
    judgeBandwidth(averageBandwidth) {
        if (averageBandwidth.megaBitsPerSecond > 1) {
            return Datacenter_1.Speed.good;
        }
        else if (averageBandwidth.megaBitsPerSecond <= 1 && averageBandwidth.megaBitsPerSecond > 0.3) {
            return Datacenter_1.Speed.ok;
        }
        else {
            return Datacenter_1.Speed.bad;
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