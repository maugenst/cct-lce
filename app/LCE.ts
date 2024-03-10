import fetch, {Response} from 'node-fetch';
import AbortController from 'abort-controller';

import {Datacenter} from '../@types/Datacenter';
import {Latency} from '../@types/Latency';
import {BandwidthMode} from '../@types/Shared';
import {Bandwidth, BandwidthPerSecond} from '../@types/Bandwidth';

export class LCE {
    cancelableLatencyRequests: AbortController[];
    cancelableBandwidthRequests: AbortController[];

    constructor() {
        this.cancelableLatencyRequests = [];
        this.cancelableBandwidthRequests = [];
    }

    async checkIfCompatibleWithSockets(ip: string): Promise<boolean> {
        try {
            const result = await this.latencyFetch(`https://${ip}/drone/index.html`);

            const droneVersion = result?.headers.get('drone-version');

            if (!droneVersion) {
                return false;
            }

            return this.isSemverVersionHigher(droneVersion);
        } catch (e) {
            return false;
        }
    }

    async getLatencyFor(datacenter: Datacenter): Promise<Latency> {
        const start = Date.now();
        await this.latencyFetch(`https://${datacenter.ip}/drone/index.html`);
        const end = Date.now();

        return {value: end - start, timestamp: Date.now()};
    }

    async getBandwidthFor(
        datacenter: Datacenter,
        bandwidthMode: BandwidthMode = BandwidthMode.big
    ): Promise<Bandwidth | null> {
        const start = Date.now();
        const response = await this.bandwidthFetch(`https://${datacenter.ip}/drone/${bandwidthMode}`);
        const end = Date.now();

        if (response !== null) {
            let rawBody;

            try {
                rawBody = await response.text();
            } catch (error) {
                console.log(error);
                return null;
            }

            const bandwidth: BandwidthPerSecond = this.calcBandwidth(rawBody.length, end - start);

            return {value: bandwidth, timestamp: Date.now()};
        }
        return null;
    }

    bandwidthFetch(url: string): Promise<Response | null> {
        const controller = new AbortController();

        this.cancelableBandwidthRequests.push(controller);
        return this.abortableFetch(url, controller);
    }

    latencyFetch(url: string): Promise<Response | null> {
        const controller: AbortController = new AbortController();

        this.cancelableLatencyRequests.push(controller);
        return this.abortableFetch(url, controller);
    }

    async abortableFetch(url: string, controller: AbortController, timeout = 3000): Promise<Response | null> {
        const timer = setTimeout(() => controller.abort(), timeout);

        try {
            const query = new URLSearchParams({
                t: `${Date.now()}`,
            }).toString();

            const result = await fetch(`${url}?${query}`, {
                signal: controller.signal,
            });

            clearTimeout(timer);
            return result;
        } catch (error) {
            console.log(error);
            clearTimeout(timer);
            return null;
        }
    }

    compare(a: {latency: number | Bandwidth}, b: {latency: number | Bandwidth}): number {
        if (a.latency < b.latency) return -1;
        if (a.latency > b.latency) return 1;
        return 0;
    }

    terminate(): void {
        this.cancelableLatencyRequests.forEach((controller) => {
            controller.abort();
        });
        this.cancelableBandwidthRequests.forEach((controller) => {
            controller.abort();
        });
        this.cancelableLatencyRequests = [];
        this.cancelableBandwidthRequests = [];
    }

    calcBandwidth(downloadSize: number, latency: number): BandwidthPerSecond {
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

    isSemverVersionHigher(version: string, baseVersion = '3.0.0'): boolean {
        const versionParts = version.split('.').map(Number);
        const baseParts = baseVersion.split('.').map(Number);

        for (let i = 0; i < 3; i++) {
            if (versionParts[i] > baseParts[i]) {
                return true;
            } else if (versionParts[i] < baseParts[i]) {
                return false;
            }
        }

        return false;
    }
}
