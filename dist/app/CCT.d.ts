/// <reference types="node" />
import { Datacenter } from "../@types/Datacenter";
import { LCE } from "./LCE";
import { Agent } from "https";
export declare class CCT {
    agent: Agent;
    datacenters: Datacenter[];
    regions: string[];
    lce: LCE;
    finishedLatency: boolean;
    finishedBandwidth: boolean;
    constructor({ httpAgent, regions }: {
        httpAgent: Agent;
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
