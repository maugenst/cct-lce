import {BandwithPerSecond} from './Bandwidth';
import {Speed} from './Datacenter';

export type FilterKeys = {
    name?: string[];
    cloud?: string[];
    town?: string[];
    country?: string[];
    tags?: string[];
};

export type LatencyDataPoint = {
    value: number;
    timestamp: number;
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
    latencies: LatencyDataPoint[];
    bandwidths: BandwidthDataPoint[];
};

export type Storage = {
    id: string;
    latencies: LatencyDataPoint[];
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

export const enum Events {
    LATENCY = 'latency',
    BANDWIDTH = 'bandwidth',
}
