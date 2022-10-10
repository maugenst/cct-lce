import { Datacenter, FilterKeys, Location, Speed, Storage } from '../@types/Datacenter';
import { LCE } from './LCE';
import { BandwidthMode, BandwithPerSecond } from '../@types/Bandwidth';
export declare class CCT {
    allDatacenters: Datacenter[];
    datacenters: Datacenter[];
    lce: LCE;
    storage: Storage[];
    runningLatency: boolean;
    runningBandwidth: boolean;
    fetchDatacenterInformationRequest(dictionaryUrl: string): Promise<Datacenter[]>;
    fetchDatacenterInformation(dictionaryUrl: string): Promise<void>;
    setFilters(filters: FilterKeys | undefined): void;
    stopMeasurements(): void;
    startLatencyChecks(iterations: number, saveToLocalStorage?: boolean): Promise<void>;
    private startMeasurementForLatency;
    startBandwidthChecks({ datacenter, iterations, bandwidthMode, saveToLocalStorage, }: {
        datacenter: Datacenter | Datacenter[];
        iterations: number;
        bandwidthMode?: BandwidthMode | undefined;
        saveToLocalStorage: boolean;
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
    clean(): void;
}
