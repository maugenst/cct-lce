import fetch, { Response } from "node-fetch";
import { Datacenter, Speed } from "../@types/Datacenter";
import { LCE } from "./LCE";
import { Util } from "./Util";
import { BandwithPerSecond } from "../@types/Bandwidth";

export class CCT {
  datacenters: Datacenter[];
  regions: string[];
  lce: LCE;
  finishedLatency: boolean = false;
  finishedBandwidth: boolean = false;

  constructor({ regions }: { regions: string[] }) {
    this.regions = regions || [];
  }

  async fetchDatacenterInformation(dictionaryUrl: string | undefined) {
    if (!dictionaryUrl) {
      throw new Error("Datacenter URL missing.");
    }

    const dcs: Datacenter[] = await fetch(dictionaryUrl).then((res: Response) =>
      res.json()
    );

    this.datacenters = this.regions
      ? dcs.filter((dc) => this.mapDatacentersOnRegions(dc))
      : dcs;

    this.clean();

    this.lce = new LCE({
      datacenters: this.datacenters,
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
          const averageLatency = Util.getAverageLatency(
            this.datacenters[index].latencies
          );
          this.datacenters[index].averageLatency = averageLatency;
          this.datacenters[index].latencyJudgement = this.judgeLatency(
            averageLatency
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
        const averageBandwidth = Util.getAverageBandwidth(
          this.datacenters[index].bandwidths
        );
        this.datacenters[index].averageBandwidth = averageBandwidth;
        this.datacenters[index].bandwidthJudgement = this.judgeBandwidth(
          averageBandwidth
        );
      }
    }
  }

  judgeLatency(averageLatency: number): Speed {
    if (averageLatency < 170) {
      return Speed.good; // green
    } else if (averageLatency >= 170 && averageLatency < 280) {
      return Speed.ok; // yellow
    } else {
      return Speed.bad; // red
    }
  }

  judgeBandwidth(averageBandwidth: BandwithPerSecond): Speed {
    if (averageBandwidth.megaBitsPerSecond > 1) {
      return Speed.good; // green
    } else if (
      averageBandwidth.megaBitsPerSecond <= 1 &&
      averageBandwidth.megaBitsPerSecond > 0.3
    ) {
      return Speed.ok; // yellow
    } else {
      return Speed.bad; // red
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
