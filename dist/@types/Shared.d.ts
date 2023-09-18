import { BandwithPerSecond } from './Bandwidth';
import { Speed } from './Datacenter';
export declare type FilterKeys = {
    name?: string[];
    cloud?: string[];
    town?: string[];
    country?: string[];
    tags?: string[];
};
export declare type LatencyDataPoint = {
    value: number;
    timestamp: number;
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
    latencies: LatencyDataPoint[];
    bandwidths: BandwidthDataPoint[];
};
export declare type Storage = {
    id: string;
    latencies: LatencyDataPoint[];
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
export declare const enum Events {
    LATENCY = "latency",
    BANDWIDTH = "bandwidth"
}
