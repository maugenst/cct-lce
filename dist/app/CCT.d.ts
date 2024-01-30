/// <reference types="node" />
import { Datacenter, Speed } from '../@types/Datacenter';
import { Events, FilterKeys, LatencyChecksParams, Location, Storage } from '../@types/Shared';
import { LCE } from './LCE';
import { BandwidthMode, BandwithPerSecond } from '../@types/Bandwidth';
import { EventEmitter } from 'events';
export declare class CCT extends EventEmitter {
    allDatacenters: Datacenter[];
    datacenters: Datacenter[];
    lce: LCE;
    storage: Storage[];
    runningLatency: boolean;
    runningBandwidth: boolean;
    filters?: FilterKeys;
    socket: any;
    constructor();
    fetchDatacenterInformationRequest(dictionaryUrl: string): Promise<Datacenter[]>;
    fetchDatacenterInformation(dictionaryUrl: string): Promise<void>;
    setFilters(filters?: FilterKeys): void;
    stopMeasurements(): void;
    startLatencyChecks(params: LatencyChecksParams): Promise<void>;
    private startCloudLatencyMeasurements;
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
    subscribe(event: Events, callback: () => void): void;
    unsubscribe(event: Events, callback: () => void): void;
    clean(): void;
}
