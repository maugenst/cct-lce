import {Datacenter, Speed} from '../@types/Datacenter';
import {Latency} from '../@types/Latency';
import {Bandwidth, BandwidthPerSecond} from '../@types/Bandwidth';

export class Util {
    static isBackEnd(): boolean {
        try {
            return Object.prototype.toString.call(global.process) === '[object process]';
        } catch (e) {
            return false;
        }
    }

    static getAverageLatency(data: Latency[] | undefined): number {
        if (!data || data.length === 0) {
            return -1;
        }

        const totalValue = data.reduce((prev, cur) => prev + cur.value, 0);
        return totalValue / data.length;
    }

    static getAverageBandwidth(data: Bandwidth[] | undefined): BandwidthPerSecond {
        if (data && data.length) {
            const bandwidthTotal: BandwidthPerSecond = data.reduce(
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
