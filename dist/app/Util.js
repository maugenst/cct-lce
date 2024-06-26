"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
const Datacenter_1 = require("../@types/Datacenter");
class Util {
    static getAverageLatency(data, startIndex = 0) {
        if (!data || data.length === 0 || startIndex >= data.length) {
            return -1;
        }
        const relevantData = data.slice(startIndex);
        const totalValue = relevantData.reduce((prev, cur) => prev + cur.value, 0);
        return totalValue / relevantData.length;
    }
    static getAverageBandwidth(data, startIndex = 0) {
        if (!data || data.length === 0 || startIndex >= data.length) {
            return {
                bitsPerSecond: -1,
                kiloBitsPerSecond: -1,
                megaBitsPerSecond: -1,
            };
        }
        const relevantData = data.slice(startIndex);
        const bandwidthTotal = relevantData.reduce((prev, cur) => {
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
        const averageCount = relevantData.length;
        return {
            bitsPerSecond: bandwidthTotal.bitsPerSecond / averageCount,
            kiloBitsPerSecond: bandwidthTotal.kiloBitsPerSecond / averageCount,
            megaBitsPerSecond: bandwidthTotal.megaBitsPerSecond / averageCount,
        };
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
    static sleep(ms, controller) {
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
    static judgeLatency(averageLatency) {
        if (averageLatency < 170) {
            return Datacenter_1.Speed.good;
        }
        else if (averageLatency >= 170 && averageLatency < 280) {
            return Datacenter_1.Speed.ok;
        }
        else {
            return Datacenter_1.Speed.bad;
        }
    }
    static judgeBandwidth(averageBandwidth) {
        if (averageBandwidth.megaBitsPerSecond > 1) {
            return Datacenter_1.Speed.good;
        }
        else if (averageBandwidth.megaBitsPerSecond <= 1 && averageBandwidth.megaBitsPerSecond > 0.3) {
            return Datacenter_1.Speed.ok;
        }
        else {
            return Datacenter_1.Speed.bad;
        }
    }
}
exports.Util = Util;
//# sourceMappingURL=Util.js.map