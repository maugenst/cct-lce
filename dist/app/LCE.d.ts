import { Response } from "node-fetch";
import { Datacenter } from "../@types/Datacenter";
import { Result } from "../@types/Result";
import { Bandwith, BandwithPerSecond } from "../@types/Bandwidth";
import { Latency } from "../@types/Latency";
export declare class LCE {
    datacenters: Datacenter[];
    agent: any;
    cancelableLatencyRequests: any[];
    cancelableBandwidthRequests: any[];
    terminateAllCalls: boolean;
    constructor({ datacenters, agent, }: {
        datacenters: Datacenter[];
        agent?: any;
    });
    runLatencyCheckForAll(): Promise<Latency[]>;
    runBandwidthCheckForAll(): Promise<Result[] | null>;
    getBandwidthForId(id: string): Promise<Bandwith | null> | null;
    getLatencyForId(id: string): Promise<Latency | null> | null;
    getLatencyFor(datacenter: Datacenter): Promise<Latency | null>;
    getBandwidthFor(datacenter: Datacenter): Promise<Bandwith | null>;
    bandwidthFetch(url: string): Promise<Response | null>;
    latencyFetch(url: string): Promise<Response | null>;
    abortableFetch(url: string, signal: any): Promise<Response | null>;
    compare(a: any, b: any): 1 | -1 | 0;
    terminate(): void;
    static calcBandwidth(downloadSize: number, latency: number): BandwithPerSecond;
}
