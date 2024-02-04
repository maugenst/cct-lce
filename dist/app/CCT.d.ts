/// <reference types="node" />
import { Datacenter, Speed } from '../@types/Datacenter';
import { CCTEvents, FilterKeys, LatencyChecksParams, Location } from '../@types/Shared';
import { BandwidthMode, BandwithPerSecond } from '../@types/Bandwidth';
import { EventEmitter } from 'events';
export declare class CCT extends EventEmitter {
    allDatacenters: Datacenter[];
    datacenters: Datacenter[];
    runningLatency: boolean;
    runningBandwidth: boolean;
    socket: any;
    private filters?;
    private storage;
    private lce;
    private abortController;
    num: number;
    constructor();
    fetchDatacenterInformationRequest(dictionaryUrl: string): Promise<Datacenter[]>;
    fetchDatacenterInformation(dictionaryUrl: string): Promise<void>;
    setFilters(filters?: FilterKeys): void;
    private startCloudLatencyMeasurements;
    stopMeasurements(): void;
    startLatencyChecks(parameters: LatencyChecksParams): Promise<void>;
    private startLocalLatencyMeasurements;
    private startMeasurementForLatency;
    private handleLatency;
    startBandwidthChecks({ iterations, bandwidthMode, saveToLocalStorage, save, }: {
        iterations: number;
        bandwidthMode?: BandwidthMode | undefined;
        saveToLocalStorage?: boolean;
        save?: boolean;
    }): Promise<void>;
    private startMeasurementForBandwidth;
    judgeLatency(averageLatency: number): Speed;
    judgeBandwidth(averageBandwidth: BandwithPerSecond): Speed;
    getCurrentDatacentersSorted(): Datacenter[];
    getAddress(): Promise<Location>;
    storeRequest(body: any): Promise<any>;
    store(location?: Location): Promise<boolean>;
    private addDataToStorage;
    private setLocalStorage;
    private readLocalStorage;
    subscribe(event: CCTEvents, callback: () => void): void;
    unsubscribe(event: CCTEvents, callback: () => void): void;
    clean(): void;
}
