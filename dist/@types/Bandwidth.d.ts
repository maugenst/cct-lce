export declare type Bandwith = {
    id: string;
    bandwidth: BandwithPerSecond;
    cloud: string;
    name: string;
    town: string;
    country: string;
    latitude: string;
    longitude: string;
    ip: string;
};
export declare type BandwithPerSecond = {
    bitsPerSecond: number;
    kiloBitsPerSecond: number;
    megaBitsPerSecond: number;
};
export declare enum BandwidthMode {
    big = "big",
    small = "small"
}
