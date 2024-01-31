export type Latency = {
    value: number;
    timestamp: number;
};

export type LatencyEventData = {
    id: string;
    latency: Latency;
};
