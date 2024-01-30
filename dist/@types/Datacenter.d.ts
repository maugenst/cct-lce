import { BandwithPerSecond } from './Bandwidth';
import { BandwidthDataPoint } from './Shared';
import { Latency } from './Latency';
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
    latencies: Latency[];
    bandwidths: BandwidthDataPoint[];
};
export declare enum Speed {
    good = "GOOD",
    ok = "OK",
    bad = "BAD",
    nothing = "NOTHING"
}
