import {BandwithPerSecond} from './Bandwidth';

export type Datacenter = {
    id: string;
    position: number;
    cloud: string;
    name: string;
    town: string;
    country: string;
    latitude: string;
    longitude: string;
    ip: string;
    tags: string;
    lastUpdate: string;
    averageLatency: number;
    latencyJudgement?: Speed;
    averageBandwidth: BandwithPerSecond;
    bandwidthJudgement?: Speed;
    latencies: number[];
    bandwidths: BandwithPerSecond[];
};

export type FilterKeys = {
    name?: string[];
    cloud?: string[];
    town?: string[];
    country?: string[];
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

export enum Speed {
    good = 'GOOD',
    ok = 'OK',
    bad = 'BAD',
    nothing = 'NOTHING',
}
