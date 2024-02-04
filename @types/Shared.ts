import {Bandwidth, BandwidthPerSecond} from './Bandwidth';
import {Speed} from './Datacenter';
import {Latency} from './Latency';

export type BandwidthChecksParams = ChecksParams & {bandwidthMode?: BandwidthMode};

export type LatencyChecksParams = ChecksParams;

type ChecksParams = {
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

export type LocalStorage = {
    id: string;
    averageLatency: number;
    latencyJudgement?: Speed;
    averageBandwidth: BandwidthPerSecond;
    bandwidthJudgement?: Speed;
    latencies: Latency[];
    bandwidths: Bandwidth[];
};

export type Storage = {
    id: string;
    latencies: Latency[];
    bandwidths: Bandwidth[];
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

export enum BandwidthMode {
    big = 'big',
    small = 'small',
}

export const enum SocketEvents {
    LATENCY = 'latency',
    LATENCY_ITERATION = 'latency:iteration',
    LATENCY_START = 'latency:start',
    LATENCY_END = 'latency:end',
    BANDWIDTH = 'bandwidth',
    BANDWIDTH_ITERATION = 'bandwidth:iteration',
    BANDWIDTH_START = 'bandwidth:start',
    BANDWIDTH_END = 'bandwidth:end',
    DISCONNECT = 'socket:disconnect',
    ERROR = 'socket:error',
}

export const enum CCTEvents {
    LATENCY = 'latency',
    LATENCY_ITERATION = 'latency:iteration',
    LATENCY_START = 'latency:start',
    LATENCY_END = 'latency:end',

    BANDWIDTH = 'bandwidth',
    BANDWIDTH_ITERATION = 'bandwidth:iteration',
    BANDWIDTH_START = 'bandwidth:start',
    BANDWIDTH_END = 'bandwidth:end',
}
