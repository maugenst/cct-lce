export type Bandwith = {
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

export type BandwithPerSecond = {
    bitsPerSecond: number;
    kiloBitsPerSecond: number;
    megaBitsPerSecond: number;
};

export enum BandwidthMode {
    big = 'big',
    small = 'small',
}
