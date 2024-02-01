import {Datacenter} from '../@types/Datacenter';
import {BandwithPerSecond} from '../@types/Bandwidth';
import {LatencyDataPoint, BandwidthDataPoint} from '../@types/Shared';

export class Util {
    static getAverageLatency(data: LatencyDataPoint[] | undefined): number {
        if (!data || data.length === 0) {
            return -1;
        }

        const totalValue = data.reduce((prev, cur) => prev + cur.value, 0);
        return totalValue / data.length;
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

    static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
        // Convert degrees to radians using arrow notation
        const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

        // Earth radius in meters
        const R = 6371e3;

        // Convert latitude and longitude from degrees to radians
        const phi1 = toRadians(lat1);
        const phi2 = toRadians(lat2);
        const deltaPhi = toRadians(lat2 - lat1);
        const deltaLambda = toRadians(lon2 - lon1);

        // Apply the Haversine formula
        const a =
            Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // Calculate the distance
        const distance = R * c;
        // Convert to kilometers and round down
        return Math.floor(distance / 1000); // returns distance in kilometers
    }

    static sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
