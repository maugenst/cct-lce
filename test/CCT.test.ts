import {CCT} from '../app/CCT';
import {LocalStorage, Speed} from '../@types/Datacenter';
import {BandwidthMode} from '../@types/Bandwidth';
import {Util} from '../app/Util';

const localStorageName = 'CCT_DATA';
const datacenters = [
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
    },
];

const localStorageMock = (() => {
    let store: any = {};
    return {
        getItem(key: any) {
            return store[key];
        },
        setItem(key: any, value: any) {
            store[key] = value.toString();
        },
        removeItem: function (key: any) {
            delete store[key];
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

describe('CCT tests', () => {
    let cct: any;
    let urlToFetchDatacenters: string;
    let fetchDatacenterInformationRequestSpy: jest.SpyInstance;

    beforeAll(async () => {
        cct = new CCT();

        fetchDatacenterInformationRequestSpy = jest
            .spyOn(cct, 'fetchDatacenterInformationRequest')
            .mockImplementation(() => {
                return Promise.resolve(datacenters);
            });

        urlToFetchDatacenters = 'someUrl';
        await cct.fetchDatacenterInformation(urlToFetchDatacenters);
    });

    beforeEach(() => {
        cct.clean();
        window.localStorage.removeItem(localStorageName);
    });

    test('should fetch datacenter information', async () => {
        expect(fetchDatacenterInformationRequestSpy).toHaveBeenCalledTimes(1);
        expect(fetchDatacenterInformationRequestSpy).toHaveBeenCalledWith(urlToFetchDatacenters);
    });

    test('should fetch datacenter information and set variables', async () => {
        expect(fetchDatacenterInformationRequestSpy).toHaveBeenCalledWith(urlToFetchDatacenters);
        expect(cct.allDatacenters).toStrictEqual(datacenters);
        expect(cct.datacenters.length).toBe(datacenters.length);
    });

    test('should filter datacenters by passed criteria', async () => {
        cct.setFilters({country: ['Netherlands']});

        expect(cct.datacenters[0].country).toBe('Netherlands');
    });

    test('should clean datacenters from recorded measurements', async () => {
        cct.setFilters({name: ['europe-west4']});

        await cct.startLatencyChecks(1);

        expect(cct.datacenters[0].latencies.length).toBe(1);

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
    });

    test('should store data to localStorage', async () => {
        cct.setFilters();

        await cct.startLatencyChecks(2, true);

        const rawLocalStorageData: string = window.localStorage.getItem(localStorageName)!;
        const localStorageData: LocalStorage[] = JSON.parse(rawLocalStorageData);

        expect(cct.datacenters[0].latencies.length).toBe(2);
        expect(localStorageData[0].latencies.length).toBe(2);
    });

    test('should read data from localStorage', async () => {
        const cctSecond = new CCT();
        jest.spyOn(cctSecond, 'fetchDatacenterInformationRequest').mockImplementation((): any => {
            return Promise.resolve(datacenters);
        });

        cct.setFilters();
        await cct.startLatencyChecks(2, true);

        expect(cct.datacenters[0].latencies.length).toBe(2);

        await cctSecond.fetchDatacenterInformation(urlToFetchDatacenters);

        expect(cctSecond.allDatacenters[0].latencies.length).toBe(2);
    });

    test('check latency', async () => {
        cct.setFilters({name: ['europe-west4']});

        await cct.startLatencyChecks(3);

        expect(cct.datacenters[0].latencies.length).toBe(3);
    });

    test('check bandwidth on one datacenter', async () => {
        cct.setFilters();

        await cct.startBandwidthChecks({datacenter: cct.datacenters[0], iterations: 3});

        expect(cct.datacenters[0].bandwidths.length).toBe(3);
    });

    test('check bandwidth [mode=small] on more than one datacenter', async () => {
        cct.setFilters();

        await cct.startBandwidthChecks({
            datacenter: cct.datacenters,
            iterations: 3,
            bandwidthMode: BandwidthMode.small,
        });

        expect(cct.datacenters[0].bandwidths.length).toBe(3);
    });

    test('latency judgement', async () => {
        cct.setFilters({name: ['europe-west4']});

        expect(cct.datacenters.length).toBe(1);

        await cct.startLatencyChecks(3);

        expect(cct.datacenters[0].latencies.length).toBe(3);
        const judgement = cct.datacenters[0].latencyJudgement;
        expect(judgement === Speed.good || judgement === Speed.ok || judgement === Speed.bad).toBeTruthy();
    });

    test('bandwidth judgement', async () => {
        cct.setFilters({name: ['europe-west4']});

        expect(cct.datacenters.length).toBe(1);

        await cct.startBandwidthChecks({datacenter: cct.datacenters[0], iterations: 3});

        expect(cct.datacenters[0].bandwidths.length).toBe(3);
        const judgement = cct.datacenters[0].bandwidthJudgement;
        expect(judgement === Speed.good || judgement === Speed.ok || judgement === Speed.bad).toBeTruthy();
    });

    test('abort running measurement', async () => {
        cct.setFilters();

        cct.startBandwidthChecks({datacenter: cct.datacenters, iterations: 30});

        expect(cct.runningBandwidth).toBeTruthy();

        await Util.sleep(2000);

        cct.stopMeasurements();

        expect(cct.runningBandwidth).toBeFalsy();
        expect(cct.runningLatency).toBeFalsy();
        expect(cct.datacenters[0].bandwidths.length).not.toBe(30);
    });

    test('run latency and bandwidth checks and store them in database', async () => {
        jest.spyOn(cct, 'storeRequest').mockImplementation(() =>
            Promise.resolve({
                status: 'OK',
            })
        );

        await cct.fetchDatacenterInformation('');

        await cct.startLatencyChecks(1);

        await cct.startBandwidthChecks({
            datacenter: cct.datacenters,
            iterations: 1,
            bandwidthMode: BandwidthMode.small,
        });

        const storeSucceeded = await cct.store();

        const sortedDatacenters = cct.getCurrentDatacentersSorted();

        expect(storeSucceeded).toBeTruthy();
        expect(Array.isArray(sortedDatacenters)).toBeTruthy();
    });
});
