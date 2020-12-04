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
import { CCT } from "../app/CCT";
import { Util } from "../app/Util";
import * as dotenv from "dotenv";
dotenv.config();
describe("CCT tests", function () {
    test("test initialization", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cct;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cct = new CCT({
                        regions: ["Galaxy", "europe-west3"],
                    });
                    return [4 /*yield*/, cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL)];
                case 1:
                    _a.sent();
                    expect(cct.datacenters.length).toEqual(2);
                    expect(cct.datacenters[0].position).toEqual(0);
                    expect(cct.datacenters[0].latencies.length).toEqual(0);
                    expect(cct.datacenters[0].bandwidths.length).toEqual(0);
                    expect(cct.datacenters[0].averageLatency).toEqual(0);
                    expect(cct.datacenters[0].averageBandwidth).toEqual({
                        bitsPerSecond: 0,
                        kiloBitsPerSecond: 0,
                        megaBitsPerSecond: 0,
                    });
                    expect(cct.datacenters[1].position).toEqual(0);
                    expect(cct.datacenters[1].latencies.length).toEqual(0);
                    expect(cct.datacenters[1].bandwidths.length).toEqual(0);
                    expect(cct.datacenters[1].averageLatency).toEqual(0);
                    expect(cct.datacenters[1].averageBandwidth).toEqual({
                        bitsPerSecond: 0,
                        kiloBitsPerSecond: 0,
                        megaBitsPerSecond: 0,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test("test cleanup", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cct;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cct = new CCT({
                        regions: ["Galaxy", "europe-west3"],
                    });
                    return [4 /*yield*/, cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL)];
                case 1:
                    _a.sent();
                    cct.startLatencyChecks(1);
                    _a.label = 2;
                case 2:
                    if (!!cct.finishedLatency) return [3 /*break*/, 4];
                    return [4 /*yield*/, Util.sleep(50)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 4:
                    cct.clean();
                    expect(cct.datacenters[0].position).toEqual(0);
                    expect(cct.datacenters[0].latencies.length).toEqual(0);
                    expect(cct.datacenters[0].bandwidths.length).toEqual(0);
                    expect(cct.datacenters[0].averageLatency).toEqual(0);
                    expect(cct.datacenters[0].averageBandwidth).toEqual({
                        bitsPerSecond: 0,
                        kiloBitsPerSecond: 0,
                        megaBitsPerSecond: 0,
                    });
                    expect(cct.datacenters[1].position).toEqual(0);
                    expect(cct.datacenters[1].latencies.length).toEqual(0);
                    expect(cct.datacenters[1].bandwidths.length).toEqual(0);
                    expect(cct.datacenters[1].averageLatency).toEqual(0);
                    expect(cct.datacenters[1].averageBandwidth).toEqual({
                        bitsPerSecond: 0,
                        kiloBitsPerSecond: 0,
                        megaBitsPerSecond: 0,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test("check latency", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cct;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cct = new CCT({
                        regions: ["Galaxy", "europe-west3"],
                    });
                    return [4 /*yield*/, cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL)];
                case 1:
                    _a.sent();
                    expect(cct.datacenters.length).toEqual(2);
                    cct.startLatencyChecks(3);
                    _a.label = 2;
                case 2:
                    if (!!cct.finishedLatency) return [3 /*break*/, 4];
                    return [4 /*yield*/, Util.sleep(50)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 4:
                    expect(cct.finishedLatency).toBeTruthy();
                    expect(cct.finishedBandwidth).toBeFalsy();
                    expect(cct.datacenters[0].latencies.length).toEqual(3);
                    expect(cct.datacenters[1].latencies.length).toEqual(3);
                    return [2 /*return*/];
            }
        });
    }); });
    test("check bandwidth", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cct;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cct = new CCT({
                        regions: ["Galaxy"],
                    });
                    return [4 /*yield*/, cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL)];
                case 1:
                    _a.sent();
                    expect(cct.datacenters.length).toEqual(1);
                    cct.startBandwidthChecks(cct.datacenters[0], 3);
                    _a.label = 2;
                case 2:
                    if (!!cct.finishedBandwidth) return [3 /*break*/, 4];
                    return [4 /*yield*/, Util.sleep(50)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 4:
                    expect(cct.finishedLatency).toBeFalsy();
                    expect(cct.finishedBandwidth).toBeTruthy();
                    expect(cct.datacenters[0].bandwidths.length).toEqual(3);
                    return [2 /*return*/];
            }
        });
    }); });
    test("abort running measurement", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cct;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cct = new CCT({
                        regions: ["Galaxy"],
                    });
                    return [4 /*yield*/, cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL)];
                case 1:
                    _a.sent();
                    expect(cct.datacenters.length).toEqual(1);
                    cct.startBandwidthChecks(cct.datacenters[0], 3);
                    _a.label = 2;
                case 2:
                    if (!!cct.finishedBandwidth) return [3 /*break*/, 4];
                    return [4 /*yield*/, Util.sleep(50)];
                case 3:
                    _a.sent();
                    cct.stopMeasurements();
                    return [3 /*break*/, 2];
                case 4:
                    expect(cct.finishedLatency).toBeFalsy();
                    expect(cct.finishedBandwidth).toBeTruthy();
                    expect(cct.datacenters[0].bandwidths.length).not.toEqual(3);
                    return [2 /*return*/];
            }
        });
    }); });
});
