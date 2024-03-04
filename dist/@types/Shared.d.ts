import { Bandwidth, BandwidthPerSecond } from './Bandwidth';
import { Speed } from './Datacenter';
import { Latency } from './Latency';
export declare type BandwidthChecksParams = ChecksParams & {
    bandwidthMode?: BandwidthMode;
};
export declare type LatencyChecksParams = ChecksParams;
declare type ChecksParams = {
    interval?: number;
    iterations?: number;
    saveToLocalStorage?: boolean;
    save?: boolean;
    from?: string;
};
export declare type FilterKeys = {
    name?: string[];
    cloud?: string[];
    town?: string[];
    country?: string[];
    tags?: string[];
};
export declare type LocalStorage = {
    id: string;
    averageLatency: number;
    latencyJudgement?: Speed;
    averageBandwidth: BandwidthPerSecond;
    bandwidthJudgement?: Speed;
    latencies: Latency[];
    bandwidths: Bandwidth[];
};
export declare type Storage = {
    id: string;
    latencies: Latency[];
    bandwidths: Bandwidth[];
    shouldSave: boolean;
};
export declare type StoreData = {
    latency: string;
    averageBandwidth: string;
    id: string;
};
export declare type Location = {
    address: string;
    latitude: number;
    longitude: number;
};
export declare enum BandwidthMode {
    big = "big",
    small = "small"
}
export declare const enum SocketEvents {
    LATENCY = "latency",
    LATENCY_ITERATION = "latency:iteration",
    LATENCY_START = "latency:start",
    LATENCY_END = "latency:end",
    BANDWIDTH = "bandwidth",
    BANDWIDTH_ITERATION = "bandwidth:iteration",
    BANDWIDTH_START = "bandwidth:start",
    BANDWIDTH_END = "bandwidth:end",
    DISCONNECT = "socket:disconnect",
    CONNECT_ERROR = "socket:connect_error",
    CONNECT = "connect"
}
export declare const enum CCTEvents {
    LATENCY = "latency",
    LATENCY_ITERATION = "latency:iteration",
    LATENCY_END = "latency:end",
    BANDWIDTH = "bandwidth",
    BANDWIDTH_ITERATION = "bandwidth:iteration",
    BANDWIDTH_END = "bandwidth:end"
}
export {};
