export type Latency = {
    value: number;
    timestamp: number;
};

export type LatencyIterationEvent = {
    id: string;
    latency: Latency;
};
