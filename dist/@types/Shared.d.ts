import { BandwithPerSecond } from './Bandwidth';
import { Speed } from './Datacenter';
import { Latency } from './Latency';
export declare type LatencyChecksParams = {
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
export declare type BandwidthDataPoint = {
    value: BandwithPerSecond;
    timestamp: number;
};
export declare type LocalStorage = {
    id: string;
    averageLatency: number;
    latencyJudgement?: Speed;
    averageBandwidth: BandwithPerSecond;
    bandwidthJudgement?: Speed;
    latencies: Latency[];
    bandwidths: BandwidthDataPoint[];
};
export declare type Storage = {
    id: string;
    latencies: Latency[];
    bandwidths: BandwidthDataPoint[];
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
export declare const enum SocketEvents {
    LATENCY = "latency",
    LATENCY_ITERATION = "latency:iteration",
    LATENCY_START = "latency:start",
    LATENCY_END = "latency:end",
    DISCONNECT = "socket:disconnect",
    ERROR = "socket:error"
}
export declare const enum CCTEvents {
    LATENCY = "latency",
    LATENCY_ITERATION = "latency:iteration",
    LATENCY_START = "latency:start",
    LATENCY_END = "latency:end"
}
