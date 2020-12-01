import {BandwithPerSecond} from "./Bandwidth";

export type Datacenter = {
  id: string;
  position: number;
  cloud: string;
  name: string;
  town: string;
  country: string;
  latitude: string;
  longitude: string;
  ip: string;
  tags: string;
  lastUpdate: string;
  averageLatency: number;
  averageBandwidth: BandwithPerSecond;
  latencies: number[];
  bandwidths: BandwithPerSecond[];
};
