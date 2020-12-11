import { Datacenter, Location, Speed } from "../@types/Datacenter";
import { LCE } from "./LCE";
import { BandwidthMode, BandwithPerSecond } from "../@types/Bandwidth";
export declare class CCT {
    allDatacenters: Datacenter[];
    datacenters: Datacenter[];
    regions: string[];
    lce: LCE;
    finishedLatency: boolean;
    finishedBandwidth: boolean;
    fetchDatacenterInformation(dictionaryUrl: string | undefined): Promise<void>;
    setRegions(regions: string[]): void;
    private mapDatacentersOnRegions;
    stopMeasurements(): void;
    startLatencyChecks(iterations: number): void;
    private startMeasurementForLatency;
    startBandwidthChecks({ datacenter, iterations, bandwidthMode, }: {
        datacenter: Datacenter | Datacenter[];
        iterations: number;
        bandwidthMode?: BandwidthMode | undefined;
    }): void;
    private startMeasurementForBandwidth;
    judgeLatency(averageLatency: number): Speed;
    judgeBandwidth(averageBandwidth: BandwithPerSecond): Speed;
    getCurrentDatacentersSorted(): Datacenter[];
    getAddress(): Promise<Location>;
    store(location?: Location): Promise<boolean>;
    clean(): void;
}
