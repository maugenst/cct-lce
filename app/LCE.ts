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

    async runLatencyCheckForAll(): Promise<Latency[]> {
        const results: Promise<Latency | null>[] = [];
        this.datacenters.forEach((datacenter) => {
            results.push(this.getLatencyFor(datacenter));
        });

        const data = await Promise.all(results);
        // filter failed requests
        const filteredData = data.filter((d) => d !== null) as Latency[];
        filteredData.sort(this.compare);
        this.cancelableLatencyRequests = [];
        return filteredData;
    }

    async runBandwidthCheckForAll(): Promise<Bandwith[]> {
        const results: Bandwith[] = [];

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

    getLatencyForId(id: string): Promise<Latency | null> | null {
        const dc = this.datacenters.find((datacenter) => datacenter.id === id);
        if (!dc) {
            return null;
        }
        return this.getLatencyFor(dc);
    }

    async getLatencyFor(datacenter: Datacenter): Promise<Latency | null> {
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
        } catch (error) {
            return null;
        }
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
        if (response !== null) {
            const end = Date.now();
            const rawBody = await response.text();
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
            };
        }
        return null;
    }

    bandwidthFetch(url: string): Promise<Response | null> {
        const controller = new AbortController();
        const {signal} = controller;
        this.cancelableBandwidthRequests.push(controller);
        return this.abortableFetch(url, signal);
    }

    latencyFetch(url: string): Promise<Response | null> {
        const controller: AbortController = new AbortController();
        const {signal} = controller;
        this.cancelableLatencyRequests.push(controller);
        return this.abortableFetch(url, signal);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async abortableFetch(url: string, signal: any): Promise<Response | null> {
        try {
            return await fetch(url, {
                signal,
            });
        } catch (error) {
            console.log(error);
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
