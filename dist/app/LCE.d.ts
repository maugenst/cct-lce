import { Response } from 'node-fetch';
import { Datacenter } from '../@types/Datacenter';
import { Latency } from '../@types/Latency';
import AbortController from 'abort-controller';
import { BandwidthMode } from '../@types/Shared';
import { Bandwidth, BandwidthPerSecond } from '../@types/Bandwidth';
export declare class LCE {
    datacenters: Datacenter[];
    cancelableLatencyRequests: AbortController[];
    cancelableBandwidthRequests: AbortController[];
    constructor();
    checkIfCompatibleWithSockets(ip: string): Promise<boolean>;
    getLatencyFor(datacenter: Datacenter): Promise<Latency>;
    getBandwidthFor(datacenter: Datacenter, bandwidthMode?: BandwidthMode): Promise<Bandwidth | null>;
    bandwidthFetch(url: string): Promise<Response | null>;
    latencyFetch(url: string): Promise<Response | null>;
    abortableFetch(url: string, controller: AbortController, timeout?: number): Promise<Response | null>;
    compare(a: {
        latency: number | Bandwidth;
    }, b: {
        latency: number | Bandwidth;
    }): number;
    terminate(): void;
    calcBandwidth(downloadSize: number, latency: number): BandwidthPerSecond;
    isSemverVersionHigher(version: string, baseVersion?: string): boolean;
}
