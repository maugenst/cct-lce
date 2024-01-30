import fetch, {Response} from 'node-fetch';
import {Datacenter} from '../@types/Datacenter';
import {BandwidthMode, Bandwith, BandwithPerSecond} from '../@types/Bandwidth';
import {Latency} from '../@types/Latency';
import AbortController from 'abort-controller';

export class LCE {
    datacenters: Datacenter[];
    cancelableLatencyRequests: AbortController[];
    cancelableBandwidthRequests: AbortController[];
    terminateAllCalls: boolean;

    constructor(datacenters: Datacenter[]) {
        this.datacenters = datacenters;
        this.cancelableLatencyRequests = [];
        this.cancelableBandwidthRequests = [];
        this.terminateAllCalls = false;
    }

    updateDatacenters(datacenters: Datacenter[]): void {
        this.datacenters = datacenters;
    }

    getBandwidthForId(
        id: string,
        options?: {
            bandwidthMode: BandwidthMode;
        }
    ): Promise<Bandwith | null> | null {
        const dc = this.datacenters.find((datacenter) => datacenter.id === id);
        if (!dc) {
            return null;
        }
        return this.getBandwidthFor(dc, options);
    }

    async getLatencyFor(datacenter: Datacenter): Promise<Latency> {
        const start = Date.now();
        await this.latencyFetch(`https://${datacenter.ip}/drone/index.html`);
        const end = Date.now();

        return {value: end - start, timestamp: Date.now()};
    }

    async getBandwidthFor(
        datacenter: Datacenter,
        options: {
            bandwidthMode: BandwidthMode;
        } = {
            bandwidthMode: BandwidthMode.big, // Default
        }
    ): Promise<Bandwith | null> {
        const start = Date.now();
        const response = await this.bandwidthFetch(`https://${datacenter.ip}/drone/${options.bandwidthMode}`);
        const end = Date.now();

        if (response !== null) {
            let rawBody;
            try {
                rawBody = await response.text();
            } catch (error) {
                console.log(error);
                return null;
            }
            const bandwidth: BandwithPerSecond = LCE.calcBandwidth(rawBody.length, end - start);

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
                timestamp: Date.now(),
            };
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

    compare(a: {latency: number | Bandwith}, b: {latency: number | Bandwith}): number {
        if (a.latency < b.latency) return -1;
        if (a.latency > b.latency) return 1;
        return 0;
    }

    terminate(): void {
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

    static calcBandwidth(downloadSize: number, latency: number): BandwithPerSecond {
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
