"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCT = void 0;
const node_fetch_1 = require("node-fetch");
const Datacenter_1 = require("../@types/Datacenter");
const LCE_1 = require("./LCE");
const Util_1 = require("./Util");
class CCT {
    constructor({ regions }) {
        this.finishedLatency = false;
        this.finishedBandwidth = false;
        this.regions = regions || [];
    }
    async fetchDatacenterInformation(dictionaryUrl) {
        if (!dictionaryUrl) {
            throw new Error("Datacenter URL missing.");
        }
        const dcs = await node_fetch_1.default(dictionaryUrl).then((res) => res.json());
        this.datacenters = this.regions
            ? dcs.filter((dc) => this.mapDatacentersOnRegions(dc))
            : dcs;
        this.clean();
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
    startBandwidthChecks(datacenter, iterations) {
        this.startMeasurementForBandwidth(datacenter, iterations).then(() => {
            this.finishedBandwidth = true;
        });
    }
    async startMeasurementForBandwidth(dc, iterations) {
        var _a;
        for (let i = 0; i < iterations; i++) {
            const result = await this.lce.getBandwidthForId(dc.id);
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