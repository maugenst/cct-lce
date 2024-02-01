"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
class Util {
    static getAverageLatency(data) {
        if (!data || data.length === 0) {
            return -1;
        }
        const totalValue = data.reduce((prev, cur) => prev + cur.value, 0);
        return totalValue / data.length;
    }
    static getAverageBandwidth(data) {
        if (data && data.length) {
            const bandwidthTotal = data.reduce((prev, cur) => {
                return {
                    bitsPerSecond: prev.bitsPerSecond + cur.value.bitsPerSecond,
                    kiloBitsPerSecond: prev.kiloBitsPerSecond + cur.value.kiloBitsPerSecond,
                    megaBitsPerSecond: prev.megaBitsPerSecond + cur.value.megaBitsPerSecond,
                };
            }, {
                bitsPerSecond: 0,
                kiloBitsPerSecond: 0,
                megaBitsPerSecond: 0,
            });
            const averageCount = data.length;
            return {
                bitsPerSecond: bandwidthTotal.bitsPerSecond / averageCount,
                kiloBitsPerSecond: bandwidthTotal.kiloBitsPerSecond / averageCount,
                megaBitsPerSecond: bandwidthTotal.megaBitsPerSecond / averageCount,
            };
        }
        else {
            return {
                bitsPerSecond: -1,
                kiloBitsPerSecond: -1,
                megaBitsPerSecond: -1,
            };
        }
    }
    static sortDatacenters(datacenters) {
        datacenters.sort((a, b) => a.averageLatency - b.averageLatency);
        datacenters.forEach((ds, i) => {
            ds.position = i + 1;
        });
        return datacenters;
    }
    static getTop3(datacenters) {
        const sorted = Util.sortDatacenters(datacenters);
        return sorted.slice(0, 3);
    }
    static calculateDistance(lat1, lon1, lat2, lon2) {
        const toRadians = (degrees) => (degrees * Math.PI) / 180;
        const R = 6371e3;
        const phi1 = toRadians(lat1);
        const phi2 = toRadians(lat2);
        const deltaPhi = toRadians(lat2 - lat1);
        const deltaLambda = toRadians(lon2 - lon1);
        const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return Math.floor(distance / 1000);
    }
    static sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
exports.Util = Util;
//# sourceMappingURL=Util.js.map