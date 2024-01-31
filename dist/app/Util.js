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
    static isBackEnd() {
        try {
            return Object.prototype.toString.call(global.process) === '[object process]';
        }
        catch (e) {
            return false;
        }
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
    static sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
exports.Util = Util;
//# sourceMappingURL=Util.js.map