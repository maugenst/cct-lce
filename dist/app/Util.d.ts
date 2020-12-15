import { Datacenter } from '../@types/Datacenter';
import { BandwithPerSecond } from '../@types/Bandwidth';
export declare class Util {
    static getAverageLatency(data: number[] | undefined): number;
    static getAverageBandwidth(data: BandwithPerSecond[] | undefined): BandwithPerSecond;
    static sortDatacenters(datacenters: Datacenter[]): Datacenter[];
    static getTop3(datacenters: Datacenter[]): Datacenter[];
    static sleep(ms: number): Promise<void>;
}
