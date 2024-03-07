/// <reference types="node" />
import { Datacenter } from '../@types/Datacenter';
import { BandwidthChecksParams, CCTEvents, FilterKeys, LatencyChecksParams, Location } from '../@types/Shared';
import { EventEmitter } from 'events';
export declare class CCT extends EventEmitter {
    allDatacenters: Datacenter[];
    datacenters: Datacenter[];
    runningLatency: boolean;
    runningBandwidth: boolean;
    private idToExclude;
    private compatibleDCsWithSockets;
    private latencySocket;
    private bandwidthSocket;
    private filters?;
    private storage;
    private lce;
    private abortControllers;
    constructor();
    fetchDatacenterInformationRequest(dictionaryUrl: string): Promise<Datacenter[]>;
    fetchDatacenterInformation(dictionaryUrl: string): Promise<void>;
    fetchCompatibleDCsWithSockets(): Promise<Datacenter[]>;
    setIdToExclude(id: string | null): void;
    setFilters(filters?: FilterKeys): void;
    stopMeasurements(): void;
    private measurementConfigs;
    startLatencyChecks(params?: LatencyChecksParams): Promise<void>;
    startBandwidthChecks(params?: BandwidthChecksParams): Promise<void>;
    private startMeasurements;
    private clearSocket;
    private startCloudMeasurements;
    private startLocalMeasurements;
    private startMeasurementFor;
    private handleLatency;
    private handleBandwidth;
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
