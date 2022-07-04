"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CCT_1 = require("../app/CCT");
const Datacenter_1 = require("../@types/Datacenter");
const Bandwidth_1 = require("../@types/Bandwidth");
describe('CCT tests', () => {
    const cct = new CCT_1.CCT();
    jest.spyOn(cct, 'fetchDatacenterInformationRequest').mockImplementation(() => {
        return Promise.resolve([
            {
                id: '2c59733c-5eb5-4e28-8eb5-a66f553adc1e',
                cloud: 'gcp',
                name: 'europe-west3',
                town: 'Frankfurt',
                country: 'Germany',
                latitude: '50.121127700000',
                longitude: '8.496482000000',
                ip: 'cct-drone-gcp-europe-west3.demo-education.cloud.sap',
                tags: 'gcp, Europe, gla',
                lastUpdate: '2021-03-03T08:45:55.000Z',
                position: 0,
                averageLatency: 0,
                averageBandwidth: { bitsPerSecond: 0, kiloBitsPerSecond: 0, megaBitsPerSecond: 0 },
                latencies: [],
                bandwidths: [],
            },
            {
                id: 'b6fda8a6-e8d5-48e6-8223-edcd2ea20054',
                cloud: 'gcp',
                name: 'europe-west4',
                town: 'Eemshaven',
                country: 'Netherlands',
                latitude: '53.435730500000',
                longitude: '6.763058200000',
                ip: 'cct-drone-gcp-europe-west4.demo-education.cloud.sap',
                tags: 'gcp, Europe, Amsterdam, SDE',
                lastUpdate: '2021-03-03T08:45:56.000Z',
                position: 0,
                averageLatency: 0,
                averageBandwidth: { bitsPerSecond: 0, kiloBitsPerSecond: 0, megaBitsPerSecond: 0 },
                latencies: [],
                bandwidths: [],
            },
            {
                id: '1764db7a-7827-4c68-aba2-6031cdd11503',
                cloud: 'gcp',
                name: 'us-west2',
                town: 'Los Angeles, CA',
                country: 'USA',
                latitude: '34.020346400000',
                longitude: '-118.972172000000',
                ip: 'cct-drone-gcp-us-west2.demo-education.cloud.sap',
                tags: 'gcp, North America',
                lastUpdate: '2021-03-03T08:45:56.000Z',
                position: 0,
                averageLatency: 0,
                averageBandwidth: { bitsPerSecond: 0, kiloBitsPerSecond: 0, megaBitsPerSecond: 0 },
                latencies: [],
                bandwidths: [],
            },
        ]);
    });
    jest.spyOn(cct, 'storeRequest').mockImplementation(() => Promise.resolve({
        status: 'OK',
    }));
    test('test initialization', async () => {
        await cct.fetchDatacenterInformation('');
        expect(cct.datacenters.length).toBe(3);
        expect(cct.datacenters[0].position).toBe(0);
        expect(cct.datacenters[0].latencies.length).toBe(0);
        expect(cct.datacenters[0].bandwidths.length).toBe(0);
        expect(cct.datacenters[0].averageLatency).toBe(0);
        expect(cct.datacenters[0].averageBandwidth).toStrictEqual({
            bitsPerSecond: 0,
            kiloBitsPerSecond: 0,
            megaBitsPerSecond: 0,
        });
    });
    test('should filter datacenters by passed criteria', async () => {
        await cct.fetchDatacenterInformation('');
        cct.setFilters({ country: ['Netherlands'] });
        expect(cct.datacenters[0].country).toBe('Netherlands');
    });
    test('test cleanup', async () => {
        await cct.fetchDatacenterInformation('');
        cct.setFilters({ name: ['europe-west4'] });
        await cct.startLatencyChecks(1);
        cct.clean();
        expect(cct.datacenters[0].position).toBe(0);
        expect(cct.datacenters[0].latencies.length).toBe(0);
        expect(cct.datacenters[0].bandwidths.length).toBe(0);
        expect(cct.datacenters[0].averageLatency).toBe(0);
        expect(cct.datacenters[0].averageBandwidth).toStrictEqual({
            bitsPerSecond: 0,
            kiloBitsPerSecond: 0,
            megaBitsPerSecond: 0,
        });
        expect(cct.finishedBandwidth).toBeFalsy();
        expect(cct.finishedLatency).toBeFalsy();
    });
    test('check latency', async () => {
        await cct.fetchDatacenterInformation('');
        cct.setFilters({ name: ['europe-west4', 'europe-west3'] });
        expect(cct.datacenters.length).toBe(2);
        await cct.startLatencyChecks(3);
        expect(cct.finishedLatency).toBeTruthy();
        expect(cct.finishedBandwidth).toBeFalsy();
        expect(cct.datacenters[0].latencies.length).toBe(3);
    });
    test('check bandwidth', async () => {
        await cct.fetchDatacenterInformation('');
        cct.setFilters({ name: ['europe-west4'] });
        expect(cct.datacenters.length).toBe(1);
        await cct.startBandwidthChecks({ datacenter: cct.datacenters[0], iterations: 3 });
        expect(cct.finishedLatency).toBeFalsy();
        expect(cct.finishedBandwidth).toBeTruthy();
        expect(cct.datacenters[0].bandwidths.length).toBe(3);
    });
    test('check bandwidth [mode=small]', async () => {
        await cct.fetchDatacenterInformation('');
        cct.setFilters({ name: ['europe-west4'] });
        expect(cct.datacenters.length).toBe(1);
        await cct.startBandwidthChecks({
            datacenter: cct.datacenters[0],
            iterations: 3,
            bandwidthMode: Bandwidth_1.BandwidthMode.small,
        });
        expect(cct.finishedLatency).toBeFalsy();
        expect(cct.finishedBandwidth).toBeTruthy();
        expect(cct.datacenters[0].bandwidths.length).toEqual(3);
    });
    test('check bandwidth [mode=small] on more than one datacenter', async () => {
        await cct.fetchDatacenterInformation('');
        cct.setFilters({ name: ['us-west2', 'europe-west3', 'europe-west4'] });
        expect(cct.datacenters.length).toBe(3);
        await cct.startBandwidthChecks({
            datacenter: cct.datacenters,
            iterations: 3,
            bandwidthMode: Bandwidth_1.BandwidthMode.small,
        });
        expect(cct.finishedLatency).toBeFalsy();
        expect(cct.finishedBandwidth).toBeTruthy();
        expect(cct.datacenters[0].bandwidths.length).toBe(3);
    });
    test('check bandwidth [mode=small] without setting regions = all known datacenters', async () => {
        await cct.fetchDatacenterInformation('');
        await cct.startBandwidthChecks({
            datacenter: cct.datacenters,
            iterations: 1,
            bandwidthMode: Bandwidth_1.BandwidthMode.small,
        });
        expect(cct.finishedLatency).toBeFalsy();
        expect(cct.finishedBandwidth).toBeTruthy();
    });
    test('latency judgement', async () => {
        await cct.fetchDatacenterInformation('');
        cct.setFilters({ name: ['europe-west4'] });
        expect(cct.datacenters.length).toBe(1);
        await cct.startLatencyChecks(3);
        expect(cct.finishedLatency).toBeTruthy();
        expect(cct.finishedBandwidth).toBeFalsy();
        expect(cct.datacenters[0].latencies.length).toBe(3);
        const judgement = cct.datacenters[0].latencyJudgement;
        expect(judgement === Datacenter_1.Speed.good || judgement === Datacenter_1.Speed.ok || judgement === Datacenter_1.Speed.bad).toBeTruthy();
    });
    test('bandwidth judgement', async () => {
        await cct.fetchDatacenterInformation('');
        cct.setFilters({ name: ['europe-west4'] });
        expect(cct.datacenters.length).toBe(1);
        await cct.startBandwidthChecks({ datacenter: cct.datacenters[0], iterations: 3 });
        expect(cct.finishedBandwidth).toBeTruthy();
        expect(cct.finishedLatency).toBeFalsy();
        expect(cct.datacenters[0].bandwidths.length).toBe(3);
        const judgement = cct.datacenters[0].bandwidthJudgement;
        expect(judgement === Datacenter_1.Speed.good || judgement === Datacenter_1.Speed.ok || judgement === Datacenter_1.Speed.bad).toBeTruthy();
    });
    test('run latency and bandwidth checks and store them in database', async () => {
        await cct.fetchDatacenterInformation('');
        await cct.startLatencyChecks(1);
        await cct.startBandwidthChecks({
            datacenter: cct.datacenters,
            iterations: 1,
            bandwidthMode: Bandwidth_1.BandwidthMode.small,
        });
        const storeSucceeded = await cct.store();
        const sortedDatacenters = cct.getCurrentDatacentersSorted();
        expect(storeSucceeded).toBeTruthy();
        expect(Array.isArray(sortedDatacenters)).toBeTruthy();
    });
});
//# sourceMappingURL=CCT.test.js.map