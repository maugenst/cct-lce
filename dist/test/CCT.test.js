"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("https");
const CCT_1 = require("../app/CCT");
const Util_1 = require("../app/Util");
const agent = new https_1.Agent({
    rejectUnauthorized: false,
});
describe("CCT tests", () => {
    test("test initialization", async () => {
        const cct = new CCT_1.CCT({
            httpAgent: agent,
            regions: ["Galaxy", "europe-west3"],
        });
        await cct.fetchDatacenterInformation("");
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
    });
    test("test cleanup", async () => {
        const cct = new CCT_1.CCT({
            httpAgent: agent,
            regions: ["Galaxy", "europe-west3"],
        });
        await cct.fetchDatacenterInformation("");
        cct.startLatencyChecks(1);
        while (!cct.finishedLatency) {
            await Util_1.Util.sleep(50);
        }
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
    });
    test("check latency", async () => {
        const cct = new CCT_1.CCT({
            httpAgent: agent,
            regions: ["Galaxy", "europe-west3"],
        });
        await cct.fetchDatacenterInformation("");
        expect(cct.datacenters.length).toEqual(2);
        cct.startLatencyChecks(3);
        while (!cct.finishedLatency) {
            await Util_1.Util.sleep(50);
        }
        expect(cct.finishedLatency).toBeTruthy();
        expect(cct.finishedBandwidth).toBeFalsy();
        expect(cct.datacenters[0].latencies.length).toEqual(3);
        expect(cct.datacenters[1].latencies.length).toEqual(3);
    });
    test("check bandwidth", async () => {
        const cct = new CCT_1.CCT({
            httpAgent: agent,
            regions: ["Galaxy"],
        });
        await cct.fetchDatacenterInformation("");
        expect(cct.datacenters.length).toEqual(1);
        cct.startBandwidthChecks(cct.datacenters[0], 3);
        while (!cct.finishedBandwidth) {
            await Util_1.Util.sleep(50);
        }
        expect(cct.finishedLatency).toBeFalsy();
        expect(cct.finishedBandwidth).toBeTruthy();
        expect(cct.datacenters[0].bandwidths.length).toEqual(3);
    });
    test("abort running measurement", async () => {
        const cct = new CCT_1.CCT({
            httpAgent: agent,
            regions: ["Galaxy"],
        });
        await cct.fetchDatacenterInformation("");
        expect(cct.datacenters.length).toEqual(1);
        cct.startBandwidthChecks(cct.datacenters[0], 3);
        while (!cct.finishedBandwidth) {
            await Util_1.Util.sleep(50);
            cct.stopMeasurements();
        }
        expect(cct.finishedLatency).toBeFalsy();
        expect(cct.finishedBandwidth).toBeTruthy();
        expect(cct.datacenters[0].bandwidths.length).not.toEqual(3);
    });
});
//# sourceMappingURL=CCT.test.js.map