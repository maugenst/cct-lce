import {BandwithPerSecond} from './Bandwidth';
import {Speed} from './Datacenter';

export type FilterKeys = {
    name?: string[];
    cloud?: string[];
    town?: string[];
    country?: string[];
};

export type LocalStorage = {
    id: string;
    averageLatency: number;
    latencyJudgement?: Speed;
    averageBandwidth: BandwithPerSecond;
    bandwidthJudgement?: Speed;
    latencies: number[];
    bandwidths: BandwithPerSecond[];
};

export type Storage = {
    id: string;
    latencies: number[];
    bandwidths: BandwithPerSecond[];
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
