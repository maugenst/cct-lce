/// <reference types="node" />
import { EventEmitter } from 'events';
import { Socket } from 'socket.io-client';
import AbortController from 'abort-controller';
import { BandwidthChecksParams, FilterKeys, LatencyChecksParams, Location, MeasurementConfig, MeasurementParams, MeasurementType } from '../@types/Shared';
import { Datacenter } from '../@types/Datacenter';
import { BandwidthEventData } from '../@types/Bandwidth';
import { LatencyEventData } from '../@types/Latency';
import { LCE } from './LCE';
export declare class CCT extends EventEmitter {
    allDatacenters: Datacenter[];
    datacenters: Datacenter[];
    runningLatency: boolean;
    runningBandwidth: boolean;
    idsToExclude: string[];
    compatibleDCsWithSockets: Datacenter[];
    filters?: FilterKeys;
    lce: LCE;
    abortControllers: AbortController[];
    sockets: {
        [key in MeasurementType]: Socket | null;
    };
    measurementConfigs: {
        [key in MeasurementType]: MeasurementConfig<any>;
    };
    constructor();
    fetchDatacenterInformation(dictionaryUrl: string): Promise<void>;
    fetchCompatibleDCsWithSockets(): Promise<Datacenter[]>;
    setFilters(filters?: FilterKeys): void;
    stopMeasurements(): void;
    startLatencyChecks(params?: LatencyChecksParams): Promise<void>;
    startBandwidthChecks(params?: BandwidthChecksParams): Promise<void>;
    startMeasurements(type: MeasurementType, params: MeasurementParams, abortController: AbortController): Promise<void>;
    setIdToExclude(ids?: string[]): void;
    clearSocket(type: MeasurementType): void;
    startCloudMeasurements<T>(config: MeasurementConfig<T>, params: MeasurementParams, dc: Datacenter, abortController: AbortController): Promise<void>;
    startLocalMeasurements<T>(config: MeasurementConfig<T>, params: MeasurementParams, abortController: AbortController): Promise<void>;
    startMeasurementFor<T>(config: MeasurementConfig<T>, dc: Datacenter, params: MeasurementParams, abortController: AbortController): Promise<{
        data: T;
        id: string;
    } | null>;
    handleEventData({ id, data }: LatencyEventData | BandwidthEventData, save: boolean, dataType: MeasurementType): void;
    getCurrentDatacentersSorted(): Datacenter[];
    getAddress(): Promise<Location | null>;
    store(location?: Location, url?: string): Promise<boolean>;
    clean(): void;
    getClosestDatacenters({ latitude, longitude, top, }: {
        latitude: number;
        longitude: number;
        top?: number;
    }): Promise<Datacenter[]>;
}
