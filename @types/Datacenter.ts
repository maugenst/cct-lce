import {BandwithPerSecond} from './Bandwidth';
import {BandwidthDataPoint, LatencyDataPoint} from './Shared';

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
    latencies: LatencyDataPoint[];
    bandwidths: BandwidthDataPoint[];
};

export enum Speed {
    good = 'GOOD',
    ok = 'OK',
    bad = 'BAD',
    nothing = 'NOTHING',
}
