import { Datacenter } from "../@types/Datacenter";
import { LCE } from "./LCE";
export declare class CCT {
    datacenters: Datacenter[];
    regions: string[];
    lce: LCE;
    finishedLatency: boolean;
    finishedBandwidth: boolean;
    constructor({ regions }: {
        regions: string[];
    });
    fetchDatacenterInformation(dictionaryUrl: string | undefined): Promise<void>;
    private mapDatacentersOnRegions;
    stopMeasurements(): void;
    startLatencyChecks(iterations: number): void;
    private startMeasurementForLatency;
    startBandwidthChecks(datacenter: Datacenter, iterations: number): void;
    private startMeasurementForBandwidth;
    getCurrentDatacentersSorted(): Datacenter[];
    clean(): void;
}
