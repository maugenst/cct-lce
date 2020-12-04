var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import fetch from "node-fetch";
import { LCE } from "./LCE";
import { Util } from "./Util";
var CCT = /** @class */ (function () {
    function CCT(_a) {
        var regions = _a.regions;
        this.finishedLatency = false;
        this.finishedBandwidth = false;
        this.regions = regions || [];
    }
    CCT.prototype.fetchDatacenterInformation = function (dictionaryUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var dcs;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!dictionaryUrl) {
                            throw new Error('Datacenter URL missing.');
                        }
                        return [4 /*yield*/, fetch(dictionaryUrl).then(function (res) {
                                return res.json();
                            })];
                    case 1:
                        dcs = _a.sent();
                        this.datacenters = this.regions
                            ? dcs.filter(function (dc) { return _this.mapDatacentersOnRegions(dc); })
                            : dcs;
                        this.clean();
                        this.lce = new LCE({
                            datacenters: this.datacenters,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    CCT.prototype.mapDatacentersOnRegions = function (dc) {
        return this.regions
            .map(function (region) { return dc.name.toLowerCase() === region.toLowerCase(); })
            .reduce(function (a, b) { return a || b; });
    };
    CCT.prototype.stopMeasurements = function () {
        this.lce.terminate();
    };
    CCT.prototype.startLatencyChecks = function (iterations) {
        var _this = this;
        this.startMeasurementForLatency(iterations).then(function () {
            _this.finishedLatency = true;
        });
    };
    CCT.prototype.startMeasurementForLatency = function (iterations) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var i, _loop_1, this_1, dcLength;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        i = 0;
                        _b.label = 1;
                    case 1:
                        if (!(i < iterations)) return [3 /*break*/, 6];
                        _loop_1 = function (dcLength) {
                            var dc, result, index;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        dc = this_1.datacenters[dcLength];
                                        return [4 /*yield*/, this_1.lce.getLatencyForId(dc.id)];
                                    case 1:
                                        result = _a.sent();
                                        if (result && result.latency) {
                                            index = this_1.datacenters.findIndex(function (e) { return e.id === dc.id; });
                                            (_a = this_1.datacenters[index].latencies) === null || _a === void 0 ? void 0 : _a.push(result.latency);
                                            this_1.datacenters[index].averageLatency = Util.getAverageLatency(this_1.datacenters[index].latencies);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        dcLength = 0;
                        _b.label = 2;
                    case 2:
                        if (!(dcLength < this.datacenters.length)) return [3 /*break*/, 5];
                        return [5 /*yield**/, _loop_1(dcLength)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        dcLength++;
                        return [3 /*break*/, 2];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    CCT.prototype.startBandwidthChecks = function (datacenter, iterations) {
        var _this = this;
        this.startMeasurementForBandwidth(datacenter, iterations).then(function () {
            _this.finishedBandwidth = true;
        });
    };
    CCT.prototype.startMeasurementForBandwidth = function (dc, iterations) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var i, result, index;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        i = 0;
                        _b.label = 1;
                    case 1:
                        if (!(i < iterations)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.lce.getBandwidthForId(dc.id)];
                    case 2:
                        result = _b.sent();
                        if (result && result.bandwidth) {
                            index = this.datacenters.findIndex(function (e) { return e.id === dc.id; });
                            (_a = this.datacenters[index].bandwidths) === null || _a === void 0 ? void 0 : _a.push(result.bandwidth);
                            this.datacenters[index].averageBandwidth = Util.getAverageBandwidth(this.datacenters[index].bandwidths);
                        }
                        _b.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CCT.prototype.getCurrentDatacentersSorted = function () {
        Util.sortDatacenters(this.datacenters);
        return this.datacenters;
    };
    CCT.prototype.clean = function () {
        this.datacenters.forEach(function (dc) {
            dc.position = 0;
            dc.averageLatency = 0;
            dc.averageBandwidth = {
                bitsPerSecond: 0,
                kiloBitsPerSecond: 0,
                megaBitsPerSecond: 0,
            };
            dc.latencies = [];
            dc.bandwidths = [];
        });
    };
    return CCT;
}());
export { CCT };
