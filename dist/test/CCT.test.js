"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CCT_1 = require("../app/CCT");
const Util_1 = require("../app/Util");
const dotenv = require("dotenv");
const Datacenter_1 = require("../@types/Datacenter");
const Bandwidth_1 = require("../@types/Bandwidth");
dotenv.config();
describe("CCT tests", () => {
    test("test initialization", async () => {
        const cct = new CCT_1.CCT();
        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);
        cct.setRegions(["Galaxy", "europe-west3"]);
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
        const cct = new CCT_1.CCT();
        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);
        cct.setRegions(["Galaxy", "europe-west3"]);
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
        const cct = new CCT_1.CCT();
        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);
        cct.setRegions(["Galaxy", "europe-west3"]);
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
        const cct = new CCT_1.CCT();
        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);
        cct.setRegions(["Galaxy"]);
        expect(cct.datacenters.length).toEqual(1);
        cct.startBandwidthChecks({ datacenter: cct.datacenters[0], iterations: 3 });
        while (!cct.finishedBandwidth) {
            await Util_1.Util.sleep(50);
        }
        expect(cct.finishedLatency).toBeFalsy();
        expect(cct.finishedBandwidth).toBeTruthy();
        expect(cct.datacenters[0].bandwidths.length).toEqual(3);
    });
    test("check bandwidth [mode=small]", async () => {
        const cct = new CCT_1.CCT();
        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);
        cct.setRegions(["Galaxy"]);
        expect(cct.datacenters.length).toEqual(1);
        cct.startBandwidthChecks({
            datacenter: cct.datacenters[0],
            iterations: 3,
            bandwidthMode: Bandwidth_1.BandwidthMode.small,
        });
        while (!cct.finishedBandwidth) {
            await Util_1.Util.sleep(50);
        }
        expect(cct.finishedLatency).toBeFalsy();
        expect(cct.finishedBandwidth).toBeTruthy();
        expect(cct.datacenters[0].bandwidths.length).toEqual(3);
    });
    test("check bandwidth [mode=small] on more than one datacenter", async () => {
        const cct = new CCT_1.CCT();
        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);
        cct.setRegions(["Galaxy", "europe-west3", "europe-west4"]);
        expect(cct.datacenters.length).toEqual(3);
        cct.startBandwidthChecks({
            datacenter: cct.datacenters,
            iterations: 3,
            bandwidthMode: Bandwidth_1.BandwidthMode.small,
        });
        while (!cct.finishedBandwidth) {
            await Util_1.Util.sleep(50);
        }
        expect(cct.finishedLatency).toBeFalsy();
        expect(cct.finishedBandwidth).toBeTruthy();
        expect(cct.datacenters[0].bandwidths.length).toEqual(3);
        expect(cct.datacenters[1].bandwidths.length).toEqual(3);
        expect(cct.datacenters[2].bandwidths.length).toEqual(3);
    });
    test("check bandwidth [mode=small] without setting regions = all known datacenters", async () => {
        const cct = new CCT_1.CCT();
        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);
        cct.startBandwidthChecks({
            datacenter: cct.datacenters,
            iterations: 1,
            bandwidthMode: Bandwidth_1.BandwidthMode.small,
        });
        while (!cct.finishedBandwidth) {
            await Util_1.Util.sleep(50);
        }
        expect(cct.finishedLatency).toBeFalsy();
        expect(cct.finishedBandwidth).toBeTruthy();
    });
    test("latency judgement", async () => {
        const cct = new CCT_1.CCT();
        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);
        cct.setRegions(["Galaxy"]);
        expect(cct.datacenters.length).toEqual(1);
        cct.startLatencyChecks(3);
        while (!cct.finishedLatency) {
            await Util_1.Util.sleep(50);
        }
        expect(cct.finishedLatency).toBeTruthy();
        expect(cct.finishedBandwidth).toBeFalsy();
        expect(cct.datacenters[0].latencies.length).toEqual(3);
        const judgement = cct.datacenters[0].latencyJudgement;
        expect(judgement === Datacenter_1.Speed.good ||
            judgement === Datacenter_1.Speed.ok ||
            judgement === Datacenter_1.Speed.bad).toBeTruthy();
    });
    test("bandwidth judgement", async () => {
        const cct = new CCT_1.CCT();
        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);
        cct.setRegions(["Galaxy"]);
        expect(cct.datacenters.length).toEqual(1);
        cct.startBandwidthChecks({ datacenter: cct.datacenters[0], iterations: 3 });
        while (!cct.finishedBandwidth) {
            await Util_1.Util.sleep(50);
        }
        expect(cct.finishedBandwidth).toBeTruthy();
        expect(cct.finishedLatency).toBeFalsy();
        expect(cct.datacenters[0].bandwidths.length).toEqual(3);
        const judgement = cct.datacenters[0].bandwidthJudgement;
        expect(judgement === Datacenter_1.Speed.good ||
            judgement === Datacenter_1.Speed.ok ||
            judgement === Datacenter_1.Speed.bad).toBeTruthy();
    });
    test("abort running measurement", async () => {
        const cct = new CCT_1.CCT();
        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);
        cct.setRegions(["Galaxy"]);
        expect(cct.datacenters.length).toEqual(1);
        cct.startBandwidthChecks({ datacenter: cct.datacenters[0], iterations: 3 });
        while (!cct.finishedBandwidth) {
            await Util_1.Util.sleep(50);
            cct.stopMeasurements();
        }
        expect(cct.finishedLatency).toBeFalsy();
        expect(cct.finishedBandwidth).toBeTruthy();
        expect(cct.datacenters[0].bandwidths.length).not.toEqual(3);
    });
    test("run latency and bandwidth checks and store them in database", async () => {
        jest.setTimeout(60000);
        const cct = new CCT_1.CCT();
        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);
        cct.setRegions(["Galaxy", "us-central1", "asia-southeast1", "australia-southeast1"]);
        cct.startLatencyChecks(10);
        while (!cct.finishedLatency) {
            await Util_1.Util.sleep(50);
        }
        cct.startBandwidthChecks({
            datacenter: cct.datacenters,
            iterations: 3,
            bandwidthMode: Bandwidth_1.BandwidthMode.small,
        });
        while (!cct.finishedBandwidth) {
            await Util_1.Util.sleep(50);
        }
        const storeSucceeded = await cct.store();
        expect(storeSucceeded).toBeTruthy();
    });
});
//# sourceMappingURL=CCT.test.js.map