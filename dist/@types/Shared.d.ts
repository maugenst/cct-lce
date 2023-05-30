import { BandwithPerSecond } from './Bandwidth';
import { Speed } from './Datacenter';
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
    averageBandwidth: BandwithPerSecond;
    bandwidthJudgement?: Speed;
    latencies: number[];
    bandwidths: BandwithPerSecond[];
};
export declare type Storage = {
    id: string;
    latencies: number[];
    bandwidths: BandwithPerSecond[];
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
