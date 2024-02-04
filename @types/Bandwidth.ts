export type Bandwidth = {
    value: BandwidthPerSecond;
    timestamp: number;
};

export type BandwidthEventData = {
    id: string;
    bandwidth: Bandwidth;
};

export type BandwidthPerSecond = {
    bitsPerSecond: number;
    kiloBitsPerSecond: number;
    megaBitsPerSecond: number;
};
