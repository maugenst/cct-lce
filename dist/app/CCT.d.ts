import { Datacenter, FilterKeys, Location, Speed } from '../@types/Datacenter';
import { LCE } from './LCE';
import { BandwidthMode, BandwithPerSecond } from '../@types/Bandwidth';
export declare class CCT {
    allDatacenters: Datacenter[];
    datacenters: Datacenter[];
    lce: LCE;
    runningLatency: boolean;
    runningBandwidth: boolean;
    fetchDatacenterInformationRequest(dictionaryUrl: string): Promise<Datacenter[]>;
    fetchDatacenterInformation(dictionaryUrl: string): Promise<void>;
    setFilters(filters: FilterKeys | undefined): void;
    stopMeasurements(): Promise<void>;
    startLatencyChecks(iterations: number): Promise<void>;
    private startMeasurementForLatency;
    startBandwidthChecks({ datacenter, iterations, bandwidthMode, }: {
        datacenter: Datacenter | Datacenter[];
        iterations: number;
        bandwidthMode?: BandwidthMode | undefined;
    }): Promise<void>;
    private startMeasurementForBandwidth;
    judgeLatency(averageLatency: number): Speed;
    judgeBandwidth(averageBandwidth: BandwithPerSecond): Speed;
    getCurrentDatacentersSorted(): Datacenter[];
    getAddress(): Promise<Location>;
    storeRequest(body: any): Promise<any>;
    store(location?: Location): Promise<boolean>;
    clean(): void;
}
