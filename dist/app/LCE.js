"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LCE = void 0;
const node_fetch_1 = require("node-fetch");
const Bandwidth_1 = require("../@types/Bandwidth");
const abort_controller_1 = require("abort-controller");
class LCE {
    constructor(datacenters) {
        this.datacenters = datacenters;
        this.cancelableLatencyRequests = [];
        this.cancelableBandwidthRequests = [];
        this.terminateAllCalls = false;
    }
    async runLatencyCheckForAll() {
        const results = [];
        this.datacenters.forEach((datacenter) => {
            results.push(this.getLatencyFor(datacenter));
        });
        const data = await Promise.all(results);
        const filteredData = data.filter((d) => d !== null);
        filteredData.sort(this.compare);
        this.cancelableLatencyRequests = [];
        return filteredData;
    }
    async runBandwidthCheckForAll() {
        const results = [];
        for (const datacenter of this.datacenters) {
            if (this.terminateAllCalls) {
                break;
            }
            const bandwidth = await this.getBandwidthFor(datacenter);
            if (bandwidth) {
                results.push(bandwidth);
            }
        }
        this.cancelableBandwidthRequests = [];
        return results;
    }
    getBandwidthForId(id, options) {
        const dc = this.datacenters.find((datacenter) => datacenter.id === id);
        if (!dc) {
            return null;
        }
        return this.getBandwidthFor(dc, options);
    }
    getLatencyForId(id) {
        const dc = this.datacenters.find((datacenter) => datacenter.id === id);
        if (!dc) {
            return null;
        }
        return this.getLatencyFor(dc);
    }
    async getLatencyFor(datacenter) {
        try {
            const start = Date.now();
            await this.latencyFetch(`https://${datacenter.ip}/drone/index.html`);
            const end = Date.now();
            return {
                id: datacenter.id,
                latency: end - start,
                cloud: datacenter.cloud,
                name: datacenter.name,
                town: datacenter.town,
                country: datacenter.country,
                latitude: datacenter.latitude,
                longitude: datacenter.longitude,
                ip: datacenter.ip,
                timestamp: Date.now(),
            };
        }
        catch (error) {
            return null;
        }
    }
    async getBandwidthFor(datacenter, options = {
        bandwidthMode: Bandwidth_1.BandwidthMode.big,
    }) {
        const start = Date.now();
        const response = await this.bandwidthFetch(`https://${datacenter.ip}/drone/${options.bandwidthMode}`);
        if (response !== null) {
            const end = Date.now();
            const rawBody = await response.text();
            const bandwidth = LCE.calcBandwidth(rawBody.length, end - start);
            return {
                id: datacenter.id,
                bandwidth,
                cloud: datacenter.cloud,
                name: datacenter.name,
                town: datacenter.town,
                country: datacenter.country,
                latitude: datacenter.latitude,
                longitude: datacenter.longitude,
                ip: datacenter.ip,
            };
        }
        return null;
    }
    bandwidthFetch(url) {
        const controller = new abort_controller_1.default();
        const { signal } = controller;
        this.cancelableBandwidthRequests.push(controller);
        return this.abortableFetch(url, signal);
    }
    latencyFetch(url) {
        const controller = new abort_controller_1.default();
        const { signal } = controller;
        this.cancelableLatencyRequests.push(controller);
        return this.abortableFetch(url, signal);
    }
    async abortableFetch(url, signal) {
        try {
            return await node_fetch_1.default(url, {
                signal,
            });
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    compare(a, b) {
        if (a.latency < b.latency)
            return -1;
        if (a.latency > b.latency)
            return 1;
        return 0;
    }
    terminate() {
        this.terminateAllCalls = true;
        this.cancelableLatencyRequests.forEach((controller) => {
            controller.abort();
        });
        this.cancelableBandwidthRequests.forEach((controller) => {
            controller.abort();
        });
        this.cancelableLatencyRequests = [];
        this.cancelableBandwidthRequests = [];
        this.terminateAllCalls = false;
    }
    static calcBandwidth(downloadSize, latency) {
        const durationinSeconds = latency / 1000;
        const bitsLoaded = downloadSize * 8;
        const bitsPerSeconds = bitsLoaded / durationinSeconds;
        const kiloBitsPerSeconds = bitsPerSeconds / 1000;
        const megaBitsPerSeconds = kiloBitsPerSeconds / 1000;
        return {
            bitsPerSecond: bitsPerSeconds,
            kiloBitsPerSecond: kiloBitsPerSeconds,
            megaBitsPerSecond: megaBitsPerSeconds,
        };
    }
}
exports.LCE = LCE;
//# sourceMappingURL=LCE.js.map