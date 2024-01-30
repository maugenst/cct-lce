import {Datacenter} from '../@types/Datacenter';
import {BandwithPerSecond} from '../@types/Bandwidth';
import {Latency} from '../@types/Latency';
import {BandwidthDataPoint} from '../@types/Shared';

export class Util {
    static getAverageLatency(data: Latency[] | undefined): number {
        if (!data || data.length === 0) {
            return -1;
        }

        const totalValue = data.reduce((prev, cur) => prev + cur.value, 0);
        return totalValue / data.length;
    }

    static isBackEnd(): boolean {
        try {
            const a = Object.prototype.toString.call(global.process) === '[object process]';
            console.log('true', a);
            return a;
        } catch (e) {
            console.log('false');
            return false;
        }
    }

    static getAverageBandwidth(data: BandwidthDataPoint[] | undefined): BandwithPerSecond {
        if (data && data.length) {
            const bandwidthTotal: BandwithPerSecond = data.reduce(
                (prev: BandwithPerSecond, cur: BandwidthDataPoint) => {
                    return {
                        bitsPerSecond: prev.bitsPerSecond + cur.value.bitsPerSecond,
                        kiloBitsPerSecond: prev.kiloBitsPerSecond + cur.value.kiloBitsPerSecond,
                        megaBitsPerSecond: prev.megaBitsPerSecond + cur.value.megaBitsPerSecond,
                    };
                },
                {
                    bitsPerSecond: 0,
                    kiloBitsPerSecond: 0,
                    megaBitsPerSecond: 0,
                }
            );

            const averageCount = data.length;

            return {
                bitsPerSecond: bandwidthTotal.bitsPerSecond / averageCount,
                kiloBitsPerSecond: bandwidthTotal.kiloBitsPerSecond / averageCount,
                megaBitsPerSecond: bandwidthTotal.megaBitsPerSecond / averageCount,
            };
        } else {
            return {
                bitsPerSecond: -1,
                kiloBitsPerSecond: -1,
                megaBitsPerSecond: -1,
            };
        }
    }

    static sortDatacenters(datacenters: Datacenter[]): Datacenter[] {
        datacenters.sort((a: Datacenter, b: Datacenter) => a.averageLatency - b.averageLatency);
        datacenters.forEach((ds: Datacenter, i: number) => {
            ds.position = i + 1;
        });
        return datacenters;
    }

    static getTop3(datacenters: Datacenter[]): Datacenter[] {
        const sorted = Util.sortDatacenters(datacenters);
        return sorted.slice(0, 3);
    }

    static sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
