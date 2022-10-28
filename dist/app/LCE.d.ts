/// <reference types="node" />
import { Response } from 'node-fetch';
import { EventEmitter } from 'events';
import { Datacenter } from '../@types/Datacenter';
import { BandwidthMode, Bandwith, BandwithPerSecond } from '../@types/Bandwidth';
import { Latency } from '../@types/Latency';
import AbortController from 'abort-controller';
export declare class LCE extends EventEmitter {
    datacenters: Datacenter[];
    cancelableLatencyRequests: AbortController[];
    cancelableBandwidthRequests: AbortController[];
    terminateAllCalls: boolean;
    constructor(datacenters: Datacenter[]);
    updateDatacenters(datacenters: Datacenter[]): void;
    runLatencyCheckForAll(): Promise<Latency[]>;
    runBandwidthCheckForAll(): Promise<Bandwith[]>;
    getBandwidthForId(id: string, options?: {
        bandwidthMode: BandwidthMode;
    }): Promise<Bandwith | null> | null;
    getLatencyForId(id: string): Promise<Latency | null> | null;
    getLatencyFor(datacenter: Datacenter): Promise<Latency | null>;
    getBandwidthFor(datacenter: Datacenter, options?: {
        bandwidthMode: BandwidthMode;
    }): Promise<Bandwith | null>;
    bandwidthFetch(url: string): Promise<Response | null>;
    latencyFetch(url: string): Promise<Response | null>;
    abortableFetch(url: string, controller: AbortController, timeout?: number): Promise<Response | null>;
    compare(a: {
        latency: number | Bandwith;
    }, b: {
        latency: number | Bandwith;
    }): number;
    terminate(): void;
    static calcBandwidth(downloadSize: number, latency: number): BandwithPerSecond;
}
