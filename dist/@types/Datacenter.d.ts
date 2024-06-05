import { Latency } from './Latency';
import { Bandwidth, BandwidthPerSecond } from './Bandwidth';
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
    averageBandwidth: BandwidthPerSecond;
    bandwidthJudgement?: Speed;
    latencies: Latency[];
    bandwidths: Bandwidth[];
    storedLatencyCount: number;
    storedBandwidthCount: number;
};
export declare enum Speed {
    good = "GOOD",
    ok = "OK",
    bad = "BAD",
    nothing = "NOTHING"
}
