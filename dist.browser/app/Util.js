var Util = /** @class */ (function () {
    function Util() {
    }
    Util.deepCopy = function (object) {
        return JSON.parse(JSON.stringify(object));
    };
    Util.getAverageLatency = function (data) {
        return data
            ? data.reduce(function (prev, cur) { return prev + cur; }, 0) / data.length
            : -1;
    };
    Util.getAverageBandwidth = function (data) {
        if (data) {
            var bandwidthAverage = data.reduce(function (prev, cur) {
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
    };
    Util.sortDatacenters = function (datacenters) {
        datacenters.sort(function (a, b) { return a.averageLatency - b.averageLatency; });
        datacenters.forEach(function (ds, i) {
            ds.position = i + 1;
        });
        return datacenters;
    };
    Util.getTop3 = function (datacenters) {
        var sorted = Util.sortDatacenters(datacenters);
        return sorted.slice(0, 3);
    };
    Util.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    return Util;
}());
export { Util };
