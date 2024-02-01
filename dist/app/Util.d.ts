import { Datacenter } from '../@types/Datacenter';
import { BandwithPerSecond } from '../@types/Bandwidth';
import { LatencyDataPoint, BandwidthDataPoint } from '../@types/Shared';
export declare class Util {
    static getAverageLatency(data: LatencyDataPoint[] | undefined): number;
    static getAverageBandwidth(data: BandwidthDataPoint[] | undefined): BandwithPerSecond;
    static sortDatacenters(datacenters: Datacenter[]): Datacenter[];
    static getTop3(datacenters: Datacenter[]): Datacenter[];
    static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
    static sleep(ms: number): Promise<void>;
}
