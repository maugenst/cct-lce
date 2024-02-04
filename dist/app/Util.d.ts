import { Datacenter } from '../@types/Datacenter';
import { Latency } from '../@types/Latency';
import { Bandwidth, BandwidthPerSecond } from '../@types/Bandwidth';
export declare class Util {
    static getAverageLatency(data: Latency[] | undefined): number;
    static isBackEnd(): boolean;
    static getAverageBandwidth(data: Bandwidth[] | undefined): BandwidthPerSecond;
    static sortDatacenters(datacenters: Datacenter[]): Datacenter[];
    static getTop3(datacenters: Datacenter[]): Datacenter[];
    static sleep(ms: number, controller: any): Promise<void>;
}
