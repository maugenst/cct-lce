import fetch, { Response } from "node-fetch";
import { Datacenter } from "../@types/Datacenter";
import { LCE } from "./LCE";
import { Agent } from "https";
import { Util } from "./Util";

export class CCT {
  agent: Agent;
  datacenters: Datacenter[];
  regions: string[];
  lce: LCE;
  finishedLatency: boolean = false;
  finishedBandwidth: boolean = false;

  constructor({ httpAgent, regions }: { httpAgent: Agent; regions: string[] }) {
    this.agent = httpAgent;
    this.regions = regions || [];
  }

  async fetchDatacenterInformation(dictionaryUrl: string) {
    const dcs: Datacenter[] = await fetch(dictionaryUrl).then((res: Response) =>
      res.json()
    );

    this.datacenters = this.regions
      ? dcs.filter((dc) => this.mapDatacentersOnRegions(dc))
      : dcs;

    this.clean();

    this.lce = new LCE({
      datacenters: this.datacenters,
      agent: this.agent,
    });
  }

  private mapDatacentersOnRegions(dc: Datacenter): boolean {
    return this.regions
      .map((region) => dc.name.toLowerCase() === region.toLowerCase())
      .reduce((a, b) => a || b);
  }

  stopMeasurements() {
    this.lce.terminate();
  }

  startLatencyChecks(iterations: number): void {
    this.startMeasurementForLatency(iterations).then(() => {
      this.finishedLatency = true;
    });
  }

  private async startMeasurementForLatency(iterations: number): Promise<void> {
    for (let i = 0; i < iterations; i++) {
      for (let dcLength = 0; dcLength < this.datacenters.length; dcLength++) {
        const dc = this.datacenters[dcLength];
        const result = await this.lce.getLatencyForId(dc.id);
        if (result && result.latency) {
          const index = this.datacenters.findIndex((e) => e.id === dc.id);

          this.datacenters[index].latencies?.push(result.latency);
          this.datacenters[index].averageLatency = Util.getAverageLatency(
            this.datacenters[index].latencies
          );
        }
      }
    }
  }

  startBandwidthChecks(datacenter: Datacenter, iterations: number): void {
    this.startMeasurementForBandwidth(datacenter, iterations).then(() => {
      this.finishedBandwidth = true;
    });
  }
  private async startMeasurementForBandwidth(
    dc: Datacenter,
    iterations: number
  ): Promise<void> {
    for (let i = 0; i < iterations; i++) {
      const result = await this.lce.getBandwidthForId(dc.id);
      if (result && result.bandwidth) {
        const index = this.datacenters.findIndex((e) => e.id === dc.id);

        this.datacenters[index].bandwidths?.push(result.bandwidth);
        this.datacenters[index].averageBandwidth = Util.getAverageBandwidth(
          this.datacenters[index].bandwidths
        );
      }
    }
  }

  getCurrentDatacentersSorted(): Datacenter[] {
    Util.sortDatacenters(this.datacenters);
    return this.datacenters;
  }

  clean() {
    this.datacenters.forEach((dc) => {
      dc.position = 0;
      dc.averageLatency = 0;
      dc.averageBandwidth = {
        bitsPerSecond: 0,
        kiloBitsPerSecond: 0,
        megaBitsPerSecond: 0,
      };
      dc.latencies = [];
      dc.bandwidths = [];
    });
  }
}
