import { Datacenter } from './Datacenter';
export type MeasurementType = 'latency' | 'bandwidth';
export type MeasurementParams = LatencyChecksParams | BandwidthChecksParams;
export type BandwidthChecksParams = ChecksParams & {
    bandwidthMode?: BandwidthMode;
};
export type LatencyChecksParams = ChecksParams;
type ChecksParams = {
    interval?: number;
    iterations?: number;
    save?: boolean;
    from?: string;
};
export interface MeasurementConfig<T> {
    type: MeasurementType;
    socketStartEvent: SocketEvents;
    socketEndEvent: SocketEvents;
    socketIterationEvent: SocketEvents;
    socketTickEvent: SocketEvents;
    iterationEvent: CCTEvents;
    tickEvent: CCTEvents;
    endEvent: CCTEvents;
    getMeasurementResult: (dc: Datacenter, params: MeasurementParams) => Promise<T>;
}
export type FilterKeys = {
    name?: string[];
    cloud?: string[];
    town?: string[];
    country?: string[];
    tags?: string[];
};
export type StoreData = {
    latency: string;
    averageBandwidth: string | null;
    id: string;
};
export type Location = {
    address: string;
    latitude: number;
    longitude: number;
};
export declare enum BandwidthMode {
    big = "big",
    small = "small"
}
export declare const enum SocketEvents {
    LATENCY = "latency",
    LATENCY_ITERATION = "latency:iteration",
    LATENCY_START = "latency:start",
    LATENCY_END = "latency:end",
    BANDWIDTH = "bandwidth",
    BANDWIDTH_ITERATION = "bandwidth:iteration",
    BANDWIDTH_START = "bandwidth:start",
    BANDWIDTH_END = "bandwidth:end",
    CONNECT = "connect",
    CONNECT_ERROR = "connect_error",
    STOP = "stop",
    DISCONNECT = "disconnect"
}
export declare const enum CCTEvents {
    LATENCY = "latency",
    LATENCY_ITERATION = "latency:iteration",
    LATENCY_END = "latency:end",
    BANDWIDTH = "bandwidth",
    BANDWIDTH_ITERATION = "bandwidth:iteration",
    BANDWIDTH_END = "bandwidth:end"
}
export {};
