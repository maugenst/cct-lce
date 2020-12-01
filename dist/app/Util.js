"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
class Util {
    static deepCopy(object) {
        return JSON.parse(JSON.stringify(object));
    }
    static getAverageLatency(data) {
        return data
            ? data.reduce((prev, cur) => prev + cur, 0) / data.length
            : -1;
    }
    static getAverageBandwidth(data) {
        if (data) {
            const bandwidthAverage = data.reduce((prev, cur) => {
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