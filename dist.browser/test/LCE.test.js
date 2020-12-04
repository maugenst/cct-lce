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
import { LCE } from "../app/LCE";
var datacenters = [
    {
        id: "07fe49e2-795b-4f06-9908-436e6dc21042",
        cloud: "gcp",
        name: "us-west1",
        town: "The Dalles, Oregon",
        country: "USA",
        latitude: "45.609579600000",
        longitude: "-121.243900200000",
        ip: "cct-drone-gcp-us-west1.demo-education.cloud.sap",
        tags: "test",
        lastUpdate: "2019-04-12T08:24:04.000Z",
        position: 1,
        averageLatency: 123,
        averageBandwidth: {
            bitsPerSecond: 123,
            kiloBitsPerSecond: 123,
            megaBitsPerSecond: 123
        },
        latencies: [123, 123, 123],
        bandwidths: [{
                bitsPerSecond: 123,
                kiloBitsPerSecond: 123,
                megaBitsPerSecond: 123
            }, {
                bitsPerSecond: 123,
                kiloBitsPerSecond: 123,
                megaBitsPerSecond: 123
            }, {
                bitsPerSecond: 123,
                kiloBitsPerSecond: 123,
                megaBitsPerSecond: 123
            }],
    },
    {
        id: "1764db7a-7827-4c68-aba2-6031cdd11503",
        cloud: "gcp",
        name: "us-west2",
        town: "Los Angeles, California",
        country: "USA",
        latitude: "34.020346400000",
        longitude: "-118.972172000000",
        ip: "cct-drone-gcp-us-west2.demo-education.cloud.sap",
        tags: "test",
        lastUpdate: "2019-04-12T08:24:04.000Z",
        position: 1,
        averageLatency: 123,
        averageBandwidth: {
            bitsPerSecond: 123,
            kiloBitsPerSecond: 123,
            megaBitsPerSecond: 123
        },
        latencies: [123, 123, 123],
        bandwidths: [{
                bitsPerSecond: 123,
                kiloBitsPerSecond: 123,
                megaBitsPerSecond: 123
            }, {
                bitsPerSecond: 123,
                kiloBitsPerSecond: 123,
                megaBitsPerSecond: 123
            }, {
                bitsPerSecond: 123,
                kiloBitsPerSecond: 123,
                megaBitsPerSecond: 123
            }],
    },
    {
        id: "1991775f-1f04-46f2-987a-9979d6dfff1f",
        cloud: "gcp",
        name: "asia-southeast1",
        town: "Jurong West",
        country: "Singapore",
        latitude: "1.344059500000",
        longitude: "103.666527500000",
        ip: "cct-drone-gcp-asia-southeast1.demo-education.cloud.sap",
        tags: "test",
        lastUpdate: "2019-04-12T08:24:05.000Z",
        position: 1,
        averageLatency: 123,
        averageBandwidth: {
            bitsPerSecond: 123,
            kiloBitsPerSecond: 123,
            megaBitsPerSecond: 123
        },
        latencies: [123, 123, 123],
        bandwidths: [{
                bitsPerSecond: 123,
                kiloBitsPerSecond: 123,
                megaBitsPerSecond: 123
            }, {
                bitsPerSecond: 123,
                kiloBitsPerSecond: 123,
                megaBitsPerSecond: 123
            }, {
                bitsPerSecond: 123,
                kiloBitsPerSecond: 123,
                megaBitsPerSecond: 123
            }],
    },
    {
        id: "2c59733c-5eb5-4e28-8eb5-a66f553adc1e",
        cloud: "gcp",
        name: "europe-west3",
        town: "Frankfurt",
        country: "Germany",
        latitude: "50.121127700000",
        longitude: "8.496482000000",
        ip: "cct-drone-gcp-europe-west3.demo-education.cloud.sap",
        tags: "test",
        lastUpdate: "2019-04-12T08:24:04.000Z",
        position: 1,
        averageLatency: 123,
        averageBandwidth: {
            bitsPerSecond: 123,
            kiloBitsPerSecond: 123,
            megaBitsPerSecond: 123
        },
        latencies: [123, 123, 123],
        bandwidths: [{
                bitsPerSecond: 123,
                kiloBitsPerSecond: 123,
                megaBitsPerSecond: 123
            }, {
                bitsPerSecond: 123,
                kiloBitsPerSecond: 123,
                megaBitsPerSecond: 123
            }, {
                bitsPerSecond: 123,
                kiloBitsPerSecond: 123,
                megaBitsPerSecond: 123
            }],
    },
];
beforeAll(function () {
    jest.setTimeout(300000);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
});
describe("lce-tests", function () {
    test("test object creation", function () { return __awaiter(void 0, void 0, void 0, function () {
        var lce;
        return __generator(this, function (_a) {
            lce = new LCE({
                datacenters: datacenters,
            });
            expect(lce.datacenters.length).toEqual(4);
            return [2 /*return*/];
        });
    }); });
    test("test - drone latency", function () { return __awaiter(void 0, void 0, void 0, function () {
        var lce, latency, bandwidth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lce = new LCE({
                        datacenters: datacenters,
                    });
                    return [4 /*yield*/, lce.getLatencyFor({
                            id: "f283eadf-2165-4bdd-9c72-cce04b881c7a",
                            cloud: "gcp",
                            name: "europe-west2",
                            town: "London",
                            country: "United Kingdom",
                            latitude: "51.528161300000",
                            longitude: "-0.662001000000",
                            tags: "test",
                            ip: "cct-drone-gcp-europe-west2.demo-education.cloud.sap",
                            lastUpdate: "2019-04-12T08:24:05.000Z",
                            position: 1,
                            averageLatency: 123,
                            averageBandwidth: {
                                bitsPerSecond: 123,
                                kiloBitsPerSecond: 123,
                                megaBitsPerSecond: 123
                            },
                            latencies: [123, 123, 123],
                            bandwidths: [{
                                    bitsPerSecond: 123,
                                    kiloBitsPerSecond: 123,
                                    megaBitsPerSecond: 123
                                }, {
                                    bitsPerSecond: 123,
                                    kiloBitsPerSecond: 123,
                                    megaBitsPerSecond: 123
                                }, {
                                    bitsPerSecond: 123,
                                    kiloBitsPerSecond: 123,
                                    megaBitsPerSecond: 123
                                }],
                        })];
                case 1:
                    latency = _a.sent();
                    expect(latency).toBeDefined();
                    expect(latency === null || latency === void 0 ? void 0 : latency.latency).toBeDefined();
                    expect(latency && latency.latency > 1).toBe(true);
                    return [4 /*yield*/, lce.getBandwidthFor({
                            id: "f283eadf-2165-4bdd-9c72-cce04b881c7a",
                            cloud: "gcp",
                            name: "europe-west2",
                            town: "London",
                            country: "United Kingdom",
                            latitude: "51.528161300000",
                            longitude: "-0.662001000000",
                            tags: "test",
                            ip: "cct-drone-gcp-europe-west2.demo-education.cloud.sap",
                            lastUpdate: "2019-04-12T08:24:05.000Z",
                            position: 1,
                            averageLatency: 123,
                            averageBandwidth: {
                                bitsPerSecond: 123,
                                kiloBitsPerSecond: 123,
                                megaBitsPerSecond: 123
                            },
                            latencies: [123, 123, 123],
                            bandwidths: [{
                                    bitsPerSecond: 123,
                                    kiloBitsPerSecond: 123,
                                    megaBitsPerSecond: 123
                                }, {
                                    bitsPerSecond: 123,
                                    kiloBitsPerSecond: 123,
                                    megaBitsPerSecond: 123
                                }, {
                                    bitsPerSecond: 123,
                                    kiloBitsPerSecond: 123,
                                    megaBitsPerSecond: 123
                                }],
                        })];
                case 2:
                    bandwidth = _a.sent();
                    expect(bandwidth).toBeDefined();
                    expect(bandwidth === null || bandwidth === void 0 ? void 0 : bandwidth.bandwidth).toBeDefined();
                    expect(bandwidth === null || bandwidth === void 0 ? void 0 : bandwidth.bandwidth.bitsPerSecond).toBeDefined();
                    expect(bandwidth === null || bandwidth === void 0 ? void 0 : bandwidth.bandwidth.kiloBitsPerSecond).toBeDefined();
                    expect(bandwidth === null || bandwidth === void 0 ? void 0 : bandwidth.bandwidth.megaBitsPerSecond).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    test("test - drone bandwidth by id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var lce, bandwidth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lce = new LCE({
                        datacenters: datacenters,
                    });
                    return [4 /*yield*/, lce.getBandwidthForId("2c59733c-5eb5-4e28-8eb5-a66f553adc1e")];
                case 1:
                    bandwidth = _a.sent();
                    expect(bandwidth).toBeDefined();
                    expect(bandwidth === null || bandwidth === void 0 ? void 0 : bandwidth.bandwidth).toBeDefined();
                    expect(bandwidth === null || bandwidth === void 0 ? void 0 : bandwidth.bandwidth.bitsPerSecond).toBeDefined();
                    expect(bandwidth === null || bandwidth === void 0 ? void 0 : bandwidth.bandwidth.kiloBitsPerSecond).toBeDefined();
                    expect(bandwidth === null || bandwidth === void 0 ? void 0 : bandwidth.bandwidth.megaBitsPerSecond).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    test("test - drone bandwidth and cancel download", function () { return __awaiter(void 0, void 0, void 0, function () {
        var lce;
        return __generator(this, function (_a) {
            lce = new LCE({
                datacenters: datacenters,
            });
            if (lce !== null) {
                // @ts-ignore
                lce
                    .getBandwidthForId("2c59733c-5eb5-4e28-8eb5-a66f553adc1e")
                    .then(function (data) { return data; })
                    .catch(function (err) { return err; });
                lce.terminate();
                expect(lce.cancelableBandwidthRequests.length).toEqual(0);
                // @ts-ignore
                lce
                    .getBandwidthForId("2c59733c-5eb5-4e28-8eb5-a66f553adc1e")
                    .then(function (bandwidth) {
                    expect(bandwidth).toBeDefined();
                    expect(bandwidth === null || bandwidth === void 0 ? void 0 : bandwidth.bandwidth).toBeDefined();
                    expect(bandwidth === null || bandwidth === void 0 ? void 0 : bandwidth.bandwidth.bitsPerSecond).toBeDefined();
                    expect(bandwidth === null || bandwidth === void 0 ? void 0 : bandwidth.bandwidth.kiloBitsPerSecond).toBeDefined();
                    expect(bandwidth === null || bandwidth === void 0 ? void 0 : bandwidth.bandwidth.megaBitsPerSecond).toBeDefined();
                })
                    .catch(function (err) { return err; });
            }
            return [2 /*return*/];
        });
    }); });
    test("test - drone all bandwidths", function () { return __awaiter(void 0, void 0, void 0, function () {
        var lce, bandwidth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lce = new LCE({
                        datacenters: datacenters,
                    });
                    return [4 /*yield*/, lce.runBandwidthCheckForAll()];
                case 1:
                    bandwidth = _a.sent();
                    expect(bandwidth && bandwidth.length > 0).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    // more to come ...
});
