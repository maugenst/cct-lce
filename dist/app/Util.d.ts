import { Datacenter, Speed } from '../@types/Datacenter';
import { Latency } from '../@types/Latency';
import { Bandwidth, BandwidthPerSecond } from '../@types/Bandwidth';
export declare class Util {
    static getAverageLatency(data: Latency[] | undefined, startIndex?: number): number;
    static getAverageBandwidth(data: Bandwidth[] | undefined, startIndex?: number): BandwidthPerSecond;
    static sortDatacenters(datacenters: Datacenter[]): Datacenter[];
    static getTop3(datacenters: Datacenter[]): Datacenter[];
    static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
    static sleep(ms: number, controller: any): Promise<void>;
    static judgeLatency(averageLatency: number): Speed;
    static judgeBandwidth(averageBandwidth: BandwidthPerSecond): Speed;
}
