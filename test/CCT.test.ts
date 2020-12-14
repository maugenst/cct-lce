import {CCT} from '../app/CCT';
import {Util} from '../app/Util';
import * as dotenv from 'dotenv';
import {Speed} from '../@types/Datacenter';
import {BandwidthMode} from '../@types/Bandwidth';

dotenv.config();

describe('CCT tests', () => {
    test('test initialization', async () => {
        const cct = new CCT();

        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);

        cct.setRegions(['europe-west5', 'europe-west3']);

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

    test('test cleanup', async () => {
        const cct = new CCT();

        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);

        cct.setRegions(['europe-west5', 'europe-west3']);
        cct.startLatencyChecks(1);

        while (!cct.finishedLatency) {
            await Util.sleep(50);
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

    test('check latency', async () => {
        const cct = new CCT();

        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);

        cct.setRegions(['europe-west5', 'europe-west3']);

        expect(cct.datacenters.length).toEqual(2);

        cct.startLatencyChecks(3);

        while (!cct.finishedLatency) {
            await Util.sleep(50);
        }

        expect(cct.finishedLatency).toBeTruthy();
        expect(cct.finishedBandwidth).toBeFalsy();
        expect(cct.datacenters[0].latencies.length).toEqual(3);
        expect(cct.datacenters[1].latencies.length).toEqual(3);
    });

    test('check bandwidth', async () => {
        const cct = new CCT();

        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);

        cct.setRegions(['europe-west5']);

        expect(cct.datacenters.length).toEqual(1);

        cct.startBandwidthChecks({datacenter: cct.datacenters[0], iterations: 3});

        while (!cct.finishedBandwidth) {
            await Util.sleep(50);
        }

        expect(cct.finishedLatency).toBeFalsy();
        expect(cct.finishedBandwidth).toBeTruthy();
        expect(cct.datacenters[0].bandwidths.length).toEqual(3);
    });

    test('check bandwidth [mode=small]', async () => {
        const cct = new CCT();

        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);

        cct.setRegions(['europe-west5']);

        expect(cct.datacenters.length).toEqual(1);

        cct.startBandwidthChecks({
            datacenter: cct.datacenters[0],
            iterations: 3,
            bandwidthMode: BandwidthMode.small,
        });

        while (!cct.finishedBandwidth) {
            await Util.sleep(50);
        }

        expect(cct.finishedLatency).toBeFalsy();
        expect(cct.finishedBandwidth).toBeTruthy();
        expect(cct.datacenters[0].bandwidths.length).toEqual(3);
    });

    test('check bandwidth [mode=small] on more than one datacenter', async () => {
        const cct = new CCT();

        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);

        cct.setRegions(['europe-west5', 'europe-west3', 'europe-west4']);

        expect(cct.datacenters.length).toEqual(3);

        cct.startBandwidthChecks({
            datacenter: cct.datacenters,
            iterations: 3,
            bandwidthMode: BandwidthMode.small,
        });

        while (!cct.finishedBandwidth) {
            await Util.sleep(50);
        }

        expect(cct.finishedLatency).toBeFalsy();
        expect(cct.finishedBandwidth).toBeTruthy();
        expect(cct.datacenters[0].bandwidths.length).toEqual(3);
        expect(cct.datacenters[1].bandwidths.length).toEqual(3);
        expect(cct.datacenters[2].bandwidths.length).toEqual(3);
    });

    test('check bandwidth [mode=small] without setting regions = all known datacenters', async () => {
        const cct = new CCT();

        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);

        cct.startBandwidthChecks({
            datacenter: cct.datacenters,
            iterations: 1,
            bandwidthMode: BandwidthMode.small,
        });

        while (!cct.finishedBandwidth) {
            await Util.sleep(50);
        }

        expect(cct.finishedLatency).toBeFalsy();
        expect(cct.finishedBandwidth).toBeTruthy();
    });

    test('latency judgement', async () => {
        const cct = new CCT();

        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);

        cct.setRegions(['europe-west5']);

        expect(cct.datacenters.length).toEqual(1);

        cct.startLatencyChecks(3);

        while (!cct.finishedLatency) {
            await Util.sleep(50);
        }

        expect(cct.finishedLatency).toBeTruthy();
        expect(cct.finishedBandwidth).toBeFalsy();
        expect(cct.datacenters[0].latencies.length).toEqual(3);
        const judgement = cct.datacenters[0].latencyJudgement;
        expect(judgement === Speed.good || judgement === Speed.ok || judgement === Speed.bad).toBeTruthy();
    });

    test('bandwidth judgement', async () => {
        const cct = new CCT();

        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);

        cct.setRegions(['europe-west5']);

        expect(cct.datacenters.length).toEqual(1);

        cct.startBandwidthChecks({datacenter: cct.datacenters[0], iterations: 3});

        while (!cct.finishedBandwidth) {
            await Util.sleep(50);
        }

        expect(cct.finishedBandwidth).toBeTruthy();
        expect(cct.finishedLatency).toBeFalsy();
        expect(cct.datacenters[0].bandwidths.length).toEqual(3);
        const judgement = cct.datacenters[0].bandwidthJudgement;
        expect(judgement === Speed.good || judgement === Speed.ok || judgement === Speed.bad).toBeTruthy();
    });

    test('abort running measurement', async () => {
        const cct = new CCT();

        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);

        cct.setRegions(['europe-west5']);

        expect(cct.datacenters.length).toEqual(1);

        cct.startBandwidthChecks({datacenter: cct.datacenters[0], iterations: 3});

        while (!cct.finishedBandwidth) {
            await Util.sleep(50);
            cct.stopMeasurements();
        }

        expect(cct.finishedLatency).toBeFalsy();
        expect(cct.finishedBandwidth).toBeTruthy();
        expect(cct.datacenters[0].bandwidths.length).not.toEqual(3);
    });

    test('run latency and bandwidth checks and store them in database', async () => {
        jest.setTimeout(60000);

        const cct = new CCT();

        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);

        cct.setRegions(['europe-west5', 'us-central1', 'asia-southeast1', 'australia-southeast1']);

        cct.startLatencyChecks(10);

        while (!cct.finishedLatency) {
            await Util.sleep(50);
        }

        cct.startBandwidthChecks({
            datacenter: cct.datacenters,
            iterations: 3,
            bandwidthMode: BandwidthMode.small,
        });

        while (!cct.finishedBandwidth) {
            await Util.sleep(50);
        }

        const storeSucceeded = await cct.store();

        const sortedDatacenters = cct.getCurrentDatacentersSorted();

        expect(storeSucceeded).toBeTruthy();
        expect(Array.isArray(sortedDatacenters)).toBeTruthy();
    });
});
