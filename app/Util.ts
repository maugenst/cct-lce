import {Datacenter, Speed} from '../@types/Datacenter';
import {Latency} from '../@types/Latency';
import {Bandwidth, BandwidthPerSecond} from '../@types/Bandwidth';

export class Util {
    static getAverageLatency(data: Latency[] | undefined, startIndex = 0): number {
        if (!data || data.length === 0 || startIndex >= data.length) {
            return -1;
        }

        const relevantData = data.slice(startIndex);
        const totalValue = relevantData.reduce((prev, cur) => prev + cur.value, 0);
        return totalValue / relevantData.length;
    }

    static getAverageBandwidth(data: Bandwidth[] | undefined, startIndex = 0): BandwidthPerSecond {
        if (!data || data.length === 0 || startIndex >= data.length) {
            return {
                bitsPerSecond: -1,
                kiloBitsPerSecond: -1,
                megaBitsPerSecond: -1,
            };
        }

        const relevantData = data.slice(startIndex);
        const bandwidthTotal: BandwidthPerSecond = relevantData.reduce(
            (prev: BandwidthPerSecond, cur: Bandwidth) => {
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

        const averageCount = relevantData.length;

        return {
            bitsPerSecond: bandwidthTotal.bitsPerSecond / averageCount,
            kiloBitsPerSecond: bandwidthTotal.kiloBitsPerSecond / averageCount,
            megaBitsPerSecond: bandwidthTotal.megaBitsPerSecond / averageCount,
        };
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

    static sleep(ms: number, controller: any): Promise<void> {
        const signal = controller.signal;

        return new Promise((resolve, _) => {
            const timeoutId = setTimeout(() => {
                resolve();
            }, ms);

            signal.addEventListener('abort', () => {
                clearTimeout(timeoutId);
                resolve();
            });
        });
    }

    static judgeLatency(averageLatency: number): Speed {
        if (averageLatency < 170) {
            return Speed.good; // green
        } else if (averageLatency >= 170 && averageLatency < 280) {
            return Speed.ok; // yellow
        } else {
            return Speed.bad; // red
        }
    }

    static judgeBandwidth(averageBandwidth: BandwidthPerSecond): Speed {
        if (averageBandwidth.megaBitsPerSecond > 1) {
            return Speed.good; // green
        } else if (averageBandwidth.megaBitsPerSecond <= 1 && averageBandwidth.megaBitsPerSecond > 0.3) {
            return Speed.ok; // yellow
        } else {
            return Speed.bad; // red
        }
    }
}
