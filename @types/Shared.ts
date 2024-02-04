import {BandwithPerSecond} from './Bandwidth';
import {Speed} from './Datacenter';
import {Latency} from './Latency';

export type LatencyChecksParams = {
    interval?: number;
    iterations?: number;
    saveToLocalStorage?: boolean;
    save?: boolean;
    from?: string;
};

export type FilterKeys = {
    name?: string[];
    cloud?: string[];
    town?: string[];
    country?: string[];
    tags?: string[];
};

export type BandwidthDataPoint = {
    value: BandwithPerSecond;
    timestamp: number;
};

export type LocalStorage = {
    id: string;
    averageLatency: number;
    latencyJudgement?: Speed;
    averageBandwidth: BandwithPerSecond;
    bandwidthJudgement?: Speed;
    latencies: Latency[];
    bandwidths: BandwidthDataPoint[];
};

export type Storage = {
    id: string;
    latencies: Latency[];
    bandwidths: BandwidthDataPoint[];
    shouldSave: boolean;
};

export type StoreData = {
    latency: string;
    averageBandwidth: string;
    id: string;
};

export type Location = {
    address: string;
    latitude: number;
    longitude: number;
};

export const enum SocketEvents {
    LATENCY = 'latency',
    LATENCY_ITERATION = 'latency:iteration',
    LATENCY_START = 'latency:start',
    LATENCY_END = 'latency:end',
    DISCONNECT = 'socket:disconnect',
    ERROR = 'socket:error',
}

export const enum CCTEvents {
    LATENCY = 'latency',
    LATENCY_ITERATION = 'latency:iteration',
    LATENCY_START = 'latency:start',
    LATENCY_END = 'latency:end',
}
