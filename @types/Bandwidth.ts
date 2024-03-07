export type Bandwidth = {
    value: BandwidthPerSecond;
    timestamp: number;
};

export type BandwidthEventData = {
    id: string;
    data: Bandwidth;
};

export type BandwidthPerSecond = {
    bitsPerSecond: number;
    kiloBitsPerSecond: number;
    megaBitsPerSecond: number;
};
