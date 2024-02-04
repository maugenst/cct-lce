import { Datacenter } from '../@types/Datacenter';
import { BandwithPerSecond } from '../@types/Bandwidth';
import { Latency } from '../@types/Latency';
import { BandwidthDataPoint } from '../@types/Shared';
export declare class Util {
    static getAverageLatency(data: Latency[] | undefined): number;
    static isBackEnd(): boolean;
    static getAverageBandwidth(data: BandwidthDataPoint[] | undefined): BandwithPerSecond;
    static sortDatacenters(datacenters: Datacenter[]): Datacenter[];
    static getTop3(datacenters: Datacenter[]): Datacenter[];
    static sleep(ms: number, controller: any): Promise<void>;
}
