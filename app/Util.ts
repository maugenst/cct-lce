import { Datacenter } from "../@types/Datacenter";
import { BandwithPerSecond } from "../@types/Bandwidth";

export class Util {
  static deepCopy(object: any): any {
    return JSON.parse(JSON.stringify(object));
  }
  static getAverageLatency(data: number[] | undefined): number {
    return data
      ? data.reduce((prev: number, cur: number) => prev + cur, 0) / data.length
      : -1;
  }

  static getAverageBandwidth(
    data: BandwithPerSecond[] | undefined
  ): BandwithPerSecond {
    if (data) {
      const bandwidthAverage: BandwithPerSecond = data.reduce((prev: BandwithPerSecond, cur: BandwithPerSecond) => {
        return {
          bitsPerSecond: (prev.bitsPerSecond + cur.bitsPerSecond),
          kiloBitsPerSecond: (prev.kiloBitsPerSecond + cur.kiloBitsPerSecond),
          megaBitsPerSecond: (prev.megaBitsPerSecond + cur.megaBitsPerSecond),
        };
      });
      return {
        bitsPerSecond: bandwidthAverage.bitsPerSecond / data.length,
        kiloBitsPerSecond: bandwidthAverage.kiloBitsPerSecond / data.length,
        megaBitsPerSecond: bandwidthAverage.megaBitsPerSecond / data.length
      }
    } else {
      return {
        bitsPerSecond: -1,
        kiloBitsPerSecond: -1,
        megaBitsPerSecond: -1,
      };
    }
  }

  static sortDatacenters(datacenters: Datacenter[]): Datacenter[] {
    datacenters.sort(
      (a: Datacenter, b: Datacenter) => a.averageLatency - b.averageLatency
    );
    datacenters.forEach((ds: Datacenter, i: number) => {
      ds.position = i + 1;
    });
    return datacenters;
  }

  static getTop3(datacenters: Datacenter[]) {
    const sorted = Util.sortDatacenters(datacenters);
    return sorted.slice(0, 3);
  }

  static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
