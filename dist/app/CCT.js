"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCT = void 0;
const uuid_1 = require("uuid");
const node_fetch_1 = require("node-fetch");
const Datacenter_1 = require("../@types/Datacenter");
const LCE_1 = require("./LCE");
const Util_1 = require("./Util");
const Bandwidth_1 = require("../@types/Bandwidth");
class CCT {
    constructor() {
        this.finishedLatency = false;
        this.finishedBandwidth = false;
    }
    async fetchDatacenterInformation(dictionaryUrl) {
        if (!dictionaryUrl) {
            throw new Error("Datacenter URL missing.");
        }
        this.allDatacenters = await node_fetch_1.default(dictionaryUrl).then((res) => res.json());
        this.datacenters = this.allDatacenters;
        this.clean();
        this.lce = new LCE_1.LCE({
            datacenters: this.datacenters,
        });
    }
    setRegions(regions) {
        this.regions = regions || [];
        this.datacenters =
            this.regions.length > 0
                ? this.allDatacenters.filter((dc) => this.mapDatacentersOnRegions(dc))
                : this.allDatacenters;
        this.lce = new LCE_1.LCE({
            datacenters: this.datacenters,
        });
    }
    mapDatacentersOnRegions(dc) {
        return this.regions
            .map((region) => dc.name.toLowerCase() === region.toLowerCase())
            .reduce((a, b) => a || b);
    }
    stopMeasurements() {
        this.lce.terminate();
    }
    startLatencyChecks(iterations) {
        this.startMeasurementForLatency(iterations).then(() => {
            this.finishedLatency = true;
        });
    }
    async startMeasurementForLatency(iterations) {
        var _a;
        for (let i = 0; i < iterations; i++) {
            for (let dcLength = 0; dcLength < this.datacenters.length; dcLength++) {
                const dc = this.datacenters[dcLength];
                const result = await this.lce.getLatencyForId(dc.id);
                if (result && result.latency) {
                    const index = this.datacenters.findIndex((e) => e.id === dc.id);
                    (_a = this.datacenters[index].latencies) === null || _a === void 0 ? void 0 : _a.push(result.latency);
                    const averageLatency = Util_1.Util.getAverageLatency(this.datacenters[index].latencies);
                    this.datacenters[index].averageLatency = averageLatency;
                    this.datacenters[index].latencyJudgement = this.judgeLatency(averageLatency);
                }
            }
        }
    }
    startBandwidthChecks({ datacenter, iterations, bandwidthMode, }) {
        if (Array.isArray(datacenter)) {
            const bandwidthMeasurementPromises = [];
            datacenter.forEach((dc) => {
                bandwidthMeasurementPromises.push(this.startMeasurementForBandwidth(dc, iterations, bandwidthMode));
            });
            Promise.all(bandwidthMeasurementPromises).then(() => {
                this.finishedBandwidth = true;
            });
        }
        else {
            this.startMeasurementForBandwidth(datacenter, iterations, bandwidthMode).then(() => {
                this.finishedBandwidth = true;
            });
        }
    }
    async startMeasurementForBandwidth(dc, iterations, bandwidthMode = Bandwidth_1.BandwidthMode.big) {
        var _a;
        for (let i = 0; i < iterations; i++) {
            const result = await this.lce.getBandwidthForId(dc.id, { bandwidthMode });
            if (result && result.bandwidth) {
                const index = this.datacenters.findIndex((e) => e.id === dc.id);
                (_a = this.datacenters[index].bandwidths) === null || _a === void 0 ? void 0 : _a.push(result.bandwidth);
                const averageBandwidth = Util_1.Util.getAverageBandwidth(this.datacenters[index].bandwidths);
                this.datacenters[index].averageBandwidth = averageBandwidth;
                this.datacenters[index].bandwidthJudgement = this.judgeBandwidth(averageBandwidth);
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
        else if (averageBandwidth.megaBitsPerSecond <= 1 &&
            averageBandwidth.megaBitsPerSecond > 0.3) {
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
            address: "",
            latitude: 0,
            longitude: 0,
        };
        if (navigator && (navigator === null || navigator === void 0 ? void 0 : navigator.geolocation)) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                location.latitude = position.coords.latitude;
                location.longitude = position.coords.longitude;
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({
                    location: new google.maps.LatLng(location.latitude, location.longitude),
                }, (results, status) => {
                    if (status === "OK") {
                        location.address = results[0].formatted_address;
                    }
                });
            });
        }
        return location;
    }
    async store(location = {
        address: "Dietmar-Hopp-Allee 16, 69190 Walldorf, Germany",
        latitude: 49.2933756,
        longitude: 8.6421212,
    }) {
        const data = [];
        this.datacenters.forEach((dc) => {
            data.push({
                id: dc.id,
                latency: `${dc.averageLatency.toFixed(2)}`,
                averageBandwidth: dc.averageBandwidth.megaBitsPerSecond.toFixed(2),
            });
        });
        const body = JSON.stringify({
            uid: uuid_1.v4(),
            address: location.address,
            latitude: location.latitude,
            longitude: location.longitude,
            data,
        }, null, 4);
        try {
            const result = await node_fetch_1.default("https://cct.demo-education.cloud.sap/measurement", {
                method: "post",
                body: body,
                headers: { "Content-Type": "application/json" },
            }).then((res) => res.json());
            return result.status === "OK";
        }
        catch (error) {
            return false;
        }
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