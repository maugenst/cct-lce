"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LCE = void 0;
const node_fetch_1 = require("node-fetch");
const abort_controller_1 = require("abort-controller");
const Shared_1 = require("../@types/Shared");
class LCE {
    constructor() {
        this.cancelableLatencyRequests = [];
        this.cancelableBandwidthRequests = [];
    }
    async checkIfCompatibleWithSockets(ip) {
        try {
            const result = await this.latencyFetch(`https://${ip}/drone/index.html`);
            const droneVersion = result === null || result === void 0 ? void 0 : result.headers.get('drone-version');
            if (!droneVersion) {
                return false;
            }
            return this.isSemverVersionHigher(droneVersion);
        }
        catch (e) {
            return false;
        }
    }
    async getLatencyFor(datacenter) {
        const start = Date.now();
        await this.latencyFetch(`https://${datacenter.ip}/drone/index.html`);
        const end = Date.now();
        return { value: end - start, timestamp: Date.now() };
    }
    async getBandwidthFor(datacenter, bandwidthMode = Shared_1.BandwidthMode.big) {
        const start = Date.now();
        const response = await this.bandwidthFetch(`https://${datacenter.ip}/drone/${bandwidthMode}`);
        const end = Date.now();
        if (response !== null) {
            let rawBody;
            try {
                rawBody = await response.text();
            }
            catch (error) {
                console.log(error);
                return null;
            }
            const bandwidth = this.calcBandwidth(rawBody.length, end - start);
            return { value: bandwidth, timestamp: Date.now() };
        }
        return null;
    }
    bandwidthFetch(url) {
        const controller = new abort_controller_1.default();
        this.cancelableBandwidthRequests.push(controller);
        return this.abortableFetch(url, controller);
    }
    latencyFetch(url) {
        const controller = new abort_controller_1.default();
        this.cancelableLatencyRequests.push(controller);
        return this.abortableFetch(url, controller);
    }
    async abortableFetch(url, controller, timeout = 3000) {
        const timer = setTimeout(() => controller.abort(), timeout);
        try {
            const query = new URLSearchParams({
                t: `${Date.now()}`,
            }).toString();
            const result = await (0, node_fetch_1.default)(`${url}?${query}`, {
                signal: controller.signal,
            });
            clearTimeout(timer);
            return result;
        }
        catch (error) {
            console.log(error);
            clearTimeout(timer);
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
        this.cancelableLatencyRequests.forEach((controller) => {
            controller.abort();
        });
        this.cancelableBandwidthRequests.forEach((controller) => {
            controller.abort();
        });
        this.cancelableLatencyRequests = [];
        this.cancelableBandwidthRequests = [];
    }
    calcBandwidth(downloadSize, latency) {
        const durationInSeconds = latency / 1000;
        const bitsLoaded = downloadSize * 8;
        const bitsPerSeconds = bitsLoaded / durationInSeconds;
        const kiloBitsPerSeconds = bitsPerSeconds / 1000;
        const megaBitsPerSeconds = kiloBitsPerSeconds / 1000;
        return {
            bitsPerSecond: bitsPerSeconds,
            kiloBitsPerSecond: kiloBitsPerSeconds,
            megaBitsPerSecond: megaBitsPerSeconds,
        };
    }
    isSemverVersionHigher(version, baseVersion = '3.0.0') {
        const versionParts = version.split('.').map(Number);
        const baseParts = baseVersion.split('.').map(Number);
        for (let i = 0; i < 3; i++) {
            if (versionParts[i] > baseParts[i]) {
                return true;
            }
            else if (versionParts[i] < baseParts[i]) {
                return false;
            }
        }
        return false;
    }
}
exports.LCE = LCE;
//# sourceMappingURL=LCE.js.map