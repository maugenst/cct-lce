import { BandwithPerSecond } from "./Bandwidth";
export declare type Datacenter = {
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
export declare enum Speed {
    good = "GOOD",
    ok = "OK",
    bad = "BAD",
    nothing = "NOTHING"
}
