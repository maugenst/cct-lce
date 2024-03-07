export declare type Bandwidth = {
    value: BandwidthPerSecond;
    timestamp: number;
};
export declare type BandwidthEventData = {
    id: string;
    data: Bandwidth;
};
export declare type BandwidthPerSecond = {
    bitsPerSecond: number;
    kiloBitsPerSecond: number;
    megaBitsPerSecond: number;
};
