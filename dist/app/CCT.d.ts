/// <reference types="node" />
import { EventEmitter } from 'events';
import { BandwidthChecksParams, FilterKeys, LatencyChecksParams, Location } from '../@types/Shared';
import { Datacenter } from '../@types/Datacenter';
export declare class CCT extends EventEmitter {
    allDatacenters: Datacenter[];
    datacenters: Datacenter[];
    runningLatency: boolean;
    runningBandwidth: boolean;
    private idsToExclude;
    private compatibleDCsWithSockets;
    private filters?;
    private lce;
    private abortControllers;
    private sockets;
    private measurementConfigs;
    constructor();
    fetchDatacenterInformationRequest(dictionaryUrl: string): Promise<Datacenter[]>;
    fetchDatacenterInformation(dictionaryUrl: string): Promise<void>;
    fetchCompatibleDCsWithSockets(): Promise<Datacenter[]>;
    setFilters(filters?: FilterKeys): void;
    stopMeasurements(): void;
    startLatencyChecks(params?: LatencyChecksParams): Promise<void>;
    startBandwidthChecks(params?: BandwidthChecksParams): Promise<void>;
    private startMeasurements;
    setIdToExclude(ids?: string[]): void;
    private clearSocket;
    private startCloudMeasurements;
    private startLocalMeasurements;
    private startMeasurementFor;
    private handleEventData;
    getCurrentDatacentersSorted(): Datacenter[];
    getAddress(): Promise<Location>;
    storeRequest(body: any): Promise<any>;
    store(location?: Location): Promise<boolean>;
    clean(): void;
}
