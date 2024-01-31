"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCT = void 0;
const uuid_1 = require("uuid");
const node_fetch_1 = require("node-fetch");
const Datacenter_1 = require("../@types/Datacenter");
const LCE_1 = require("./LCE");
const Util_1 = require("./Util");
const Bandwidth_1 = require("../@types/Bandwidth");
const events_1 = require("events");
const socket_io_client_1 = require("socket.io-client");
const localStorageName = 'CCT_DATA';
class CCT extends events_1.EventEmitter {
    constructor() {
        super();
        this.runningLatency = false;
        this.runningBandwidth = false;
        this.storage = [];
    }
    async fetchDatacenterInformationRequest(dictionaryUrl) {
        try {
            return (await (0, node_fetch_1.default)(dictionaryUrl).then((res) => res.json()));
        }
        catch (_a) {
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
        this.lce = new LCE_1.LCE(this.datacenters);
    }
    setFilters(filters) {
        if (!filters) {
            this.lce.updateDatacenters(this.allDatacenters);
            return;
        }
        this.datacenters = this.allDatacenters.filter((dc) => Object.keys(filters).every((key) => {
            if (key === 'tags') {
                return filters[key].some((tag) => {
                    return dc[key].toLowerCase().includes(tag.toLowerCase());
                });
            }
            return filters[key].map((filterVal) => filterVal.toLowerCase()).includes(dc[key].toLowerCase());
        }));
        this.lce.updateDatacenters(this.datacenters);
        this.filters = filters;
    }
    stopMeasurements() {
        this.runningLatency = false;
        this.runningBandwidth = false;
        if (this.socket) {
            this.socket.emit("socket:disconnect");
            this.socket = null;
            return;
        }
        this.lce.terminate();
    }
    async startLatencyChecks(parameters) {
        console.log(2222, '2222');
        this.runningLatency = true;
        if (parameters.from) {
            const index = this.datacenters.findIndex((e) => e.id === parameters.from);
            await this.startCloudLatencyMeasurements(this.datacenters[index], parameters);
        }
        else {
            await this.startLocalLatencyMeasurements(parameters);
        }
        this.runningLatency = false;
    }
    async startCloudLatencyMeasurements(dc, { iterations, save, saveToLocalStorage }) {
        console.log(dc);
        if (Util_1.Util.isBackEnd()) {
            return;
        }
        if (this.socket) {
            this.socket.emit("socket:disconnect");
            this.socket = null;
        }
        this.socket = (0, socket_io_client_1.io)('ws://localhost');
        this.socket.on('connect', () => this.socket.emit("latency:start", iterations, this.filters));
        this.socket.on("socket:disconnect", () => this.stopMeasurements());
        this.socket.on("latency", (latencyEventData) => {
            this.handleLatency(latencyEventData, save, saveToLocalStorage);
            this.emit("latency", latencyEventData);
        });
        this.socket.on("latency:iteration", (latencyEventData) => {
            this.emit("latency:iteration", latencyEventData);
        });
    }
    async startLocalLatencyMeasurements({ iterations = 16, save, saveToLocalStorage, }) {
        while (this.runningLatency && iterations > 0) {
            const latencyIterationEventData = await Promise.all(this.datacenters.map((dc) => this.startMeasurementForLatency(dc, saveToLocalStorage, save)));
            this.emit("latency:iteration", latencyIterationEventData);
            iterations--;
        }
    }
    async startMeasurementForLatency(dc, save, saveToLocalStorage) {
        const latency = await this.lce.getLatencyFor(dc);
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
    async startBandwidthChecks({ iterations, bandwidthMode, saveToLocalStorage = false, save = true, }) {
        this.runningBandwidth = true;
        const bandwidthMeasurementPromises = [];
        for (let dcLength = 0; dcLength < this.datacenters.length; dcLength++) {
            const dc = this.datacenters[dcLength];
            bandwidthMeasurementPromises.push(this.startMeasurementForBandwidth({ iterations, dc, bandwidthMode, saveToLocalStorage, save }));
        }
        await Promise.all(bandwidthMeasurementPromises);
        this.runningBandwidth = false;
    }
    async startMeasurementForBandwidth({ iterations, dc, bandwidthMode = Bandwidth_1.BandwidthMode.big, saveToLocalStorage = false, save = false, }) {
        var _a;
        for (let i = 0; i < iterations; i++) {
            const result = await this.lce.getBandwidthForId(dc.id, { bandwidthMode });
            if (!this.runningBandwidth) {
                return;
            }
            if (result && result.bandwidth && save) {
                const index = this.datacenters.findIndex((e) => e.id === dc.id);
                const dataPoint = { value: result.bandwidth, timestamp: result.timestamp };
                (_a = this.datacenters[index].bandwidths) === null || _a === void 0 ? void 0 : _a.push(dataPoint);
                const averageBandwidth = Util_1.Util.getAverageBandwidth(this.datacenters[index].bandwidths);
                this.datacenters[index].averageBandwidth = averageBandwidth;
                this.datacenters[index].bandwidthJudgement = this.judgeBandwidth(averageBandwidth);
                this.addDataToStorage(dc.id, dataPoint);
                if (saveToLocalStorage) {
                    this.setLocalStorage();
                }
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