"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CCT_1 = require("../app/CCT");
jest.mock('node-fetch', () => {
    const originalModule = jest.requireActual('node-fetch');
    return {
        __esModule: true,
        default: jest.fn().mockImplementation(originalModule.default),
        Response: originalModule.Response,
    };
});
global.google = {
    maps: {
        Geocoder: jest.fn().mockImplementation(() => ({
            geocode: jest.fn((_request, callback) => {
                callback([{ formatted_address: 'Mocked Address' }], 'OK');
            }),
        })),
        LatLng: jest.fn(),
    },
};
const node_fetch_1 = require("node-fetch");
const Datacenter_1 = require("../@types/Datacenter");
const Util_1 = require("../app/Util");
describe('CCT', () => {
    let cct;
    beforeEach(() => {
        cct = new CCT_1.CCT();
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe('fetchDatacenterInformation', () => {
        it('should update datacenters based on the successfully fetched information', async () => {
            const mockResponse = [{ id: 'dc1', ip: '192.168.1.1' }];
            node_fetch_1.default.mockResolvedValue({
                json: () => Promise.resolve(mockResponse),
            });
            const dictionaryUrl = 'https://example.com/datacenters.json';
            await cct.fetchDatacenterInformation(dictionaryUrl);
            expect(cct.allDatacenters).toEqual(mockResponse);
            expect(cct.datacenters).toEqual(mockResponse);
        });
        it('should set datacenters to an empty array if fetching information fails', async () => {
            node_fetch_1.default.mockResolvedValue({
                json: () => Promise.reject(new Error('error')),
            });
            const dictionaryUrl = 'https://example.com/datacenters.json';
            await cct.fetchDatacenterInformation(dictionaryUrl);
            expect(cct.allDatacenters).toEqual([]);
            expect(cct.datacenters).toEqual([]);
        });
    });
    describe('fetchCompatibleDCsWithSockets', () => {
        it('should update compatibleDCsWithSockets with only those datacenters that are compatible with sockets', async () => {
            cct.datacenters = [
                { id: 'dc1', ip: '192.168.1.1' },
                { id: 'dc2', ip: '192.168.1.2' },
                { id: 'dc3', ip: '192.168.1.3' },
            ];
            jest.spyOn(cct.lce, 'checkIfCompatibleWithSockets')
                .mockResolvedValueOnce(true)
                .mockResolvedValueOnce(false)
                .mockResolvedValueOnce(true);
            const compatibleDCs = await cct.fetchCompatibleDCsWithSockets();
            expect(compatibleDCs).toEqual([
                { id: 'dc1', ip: '192.168.1.1' },
                { id: 'dc3', ip: '192.168.1.3' },
            ]);
            expect(cct.lce.checkIfCompatibleWithSockets).toHaveBeenNthCalledWith(1, '192.168.1.1');
            expect(cct.lce.checkIfCompatibleWithSockets).toHaveBeenNthCalledWith(2, '192.168.1.2');
            expect(cct.lce.checkIfCompatibleWithSockets).toHaveBeenNthCalledWith(3, '192.168.1.3');
            expect(cct.compatibleDCsWithSockets).toHaveLength(2);
        });
    });
    describe('setFilters', () => {
        beforeEach(() => {
            cct.allDatacenters = [
                { id: 'dc1', name: 'Datacenter1', tags: 'fast,secure', country: 'USA' },
                { id: 'dc2', name: 'Datacenter2', tags: 'fast', country: 'Germany' },
                { id: 'dc3', name: 'Datacenter3', tags: 'secure', country: 'France' },
            ];
            cct.setIdToExclude(['dc3']);
        });
        it('should filter datacenters based on the provided filters', () => {
            const filters = {
                tags: ['fast'],
                country: ['Germany'],
            };
            cct.setFilters(filters);
            expect(cct.datacenters).toEqual([{ id: 'dc2', name: 'Datacenter2', tags: 'fast', country: 'Germany' }]);
        });
        it('should exclude datacenters based on idsToExclude', () => {
            cct.setFilters();
            expect(cct.datacenters).not.toContainEqual(expect.objectContaining({ id: 'dc3' }));
        });
        it('should handle the special "tags" filter correctly', () => {
            const filters = {
                tags: ['secure'],
            };
            cct.setFilters(filters);
            expect(cct.datacenters).toEqual([{ id: 'dc1', name: 'Datacenter1', tags: 'fast,secure', country: 'USA' }]);
        });
        it('should return all datacenters when no filters are provided', () => {
            cct.setFilters();
            expect(cct.datacenters).toEqual([
                { id: 'dc1', name: 'Datacenter1', tags: 'fast,secure', country: 'USA' },
                { id: 'dc2', name: 'Datacenter2', tags: 'fast', country: 'Germany' },
            ]);
        });
    });
    describe('stopMeasurements', () => {
        it('should stop latency and bandwidth measurements, abort all controllers, terminate LCE, and emit end events', () => {
            cct.runningLatency = true;
            cct.runningBandwidth = true;
            const abortControllerMock1 = { abort: jest.fn() };
            const abortControllerMock2 = { abort: jest.fn() };
            cct.abortControllers = [abortControllerMock1, abortControllerMock2];
            jest.spyOn(cct.lce, 'terminate').mockImplementation();
            jest.spyOn(cct, 'emit').mockImplementation();
            cct.stopMeasurements();
            expect(cct.runningLatency).toBe(false);
            expect(cct.runningBandwidth).toBe(false);
            expect(abortControllerMock1.abort).toHaveBeenCalled();
            expect(abortControllerMock2.abort).toHaveBeenCalled();
            expect(cct.abortControllers).toHaveLength(0);
            expect(cct.lce.terminate).toHaveBeenCalled();
            expect(cct.emit).toHaveBeenCalledWith("latency:end");
            expect(cct.emit).toHaveBeenCalledWith("bandwidth:end");
        });
    });
    describe('startLatencyChecks', () => {
        it('should initiate latency checks with default parameters when none are provided', async () => {
            jest.spyOn(cct, 'startMeasurements').mockImplementation(async () => { });
            await cct.startLatencyChecks();
            expect(cct.startMeasurements).toHaveBeenCalledWith('latency', { iterations: 16, save: true }, expect.any(Object));
        });
        it('should initiate latency checks with provided parameters', async () => {
            jest.spyOn(cct, 'startMeasurements').mockImplementation(async () => { });
            await cct.startLatencyChecks({ iterations: 10, save: false });
            expect(cct.startMeasurements).toHaveBeenCalledWith('latency', { iterations: 10, save: false }, expect.any(Object));
        });
    });
    describe('startBandwidthChecks', () => {
        it('should initiate bandwidth checks with default parameters when none are provided', async () => {
            jest.spyOn(cct, 'startMeasurements').mockImplementation(async () => { });
            await cct.startBandwidthChecks();
            expect(cct.startMeasurements).toHaveBeenCalledWith('bandwidth', { iterations: 4, save: true }, expect.any(Object));
        });
        it('should initiate bandwidth checks with provided parameters', async () => {
            jest.spyOn(cct, 'startMeasurements').mockImplementation(async () => { });
            await cct.startBandwidthChecks({ iterations: 2, save: false });
            expect(cct.startMeasurements).toHaveBeenCalledWith('bandwidth', { iterations: 2, save: false }, expect.any(Object));
        });
    });
    describe('setIdToExclude', () => {
        it('should update idsToExclude and reapply filters', () => {
            jest.spyOn(cct, 'setFilters').mockImplementation();
            const testIds = ['dc1', 'dc2'];
            cct.setIdToExclude(testIds);
            expect(cct.idsToExclude).toEqual(testIds);
            expect(cct.setFilters).toHaveBeenCalledWith(cct.filters);
        });
        it('should set idsToExclude to an empty array if no ids are provided', () => {
            jest.spyOn(cct, 'setFilters').mockImplementation();
            cct.setIdToExclude();
            expect(cct.idsToExclude).toEqual([]);
            expect(cct.setFilters).toHaveBeenCalledWith(cct.filters);
        });
    });
    describe('clearSocket', () => {
        it('should stop and clear the socket for the given type', () => {
            const mockSocket = {
                emit: jest.fn(),
                removeAllListeners: jest.fn(),
            };
            cct.sockets['latency'] = mockSocket;
            cct.clearSocket('latency');
            expect(mockSocket.emit).toHaveBeenCalledWith("stop");
            expect(mockSocket.removeAllListeners).toHaveBeenCalled();
            expect(cct.sockets['latency']).toBeNull();
        });
    });
    describe('getAddress', () => {
        it('should resolve with location containing address, latitude, and longitude', async () => {
            Object.defineProperty(global, 'navigator', {
                value: {
                    geolocation: {
                        getCurrentPosition: jest.fn().mockImplementation((successCallback) => {
                            const position = {
                                coords: {
                                    latitude: 10,
                                    longitude: 20,
                                },
                            };
                            successCallback(position);
                        }),
                    },
                },
                configurable: true,
            });
            const location = await cct.getAddress();
            expect(location).toEqual({
                address: 'Mocked Address',
                latitude: 10,
                longitude: 20,
            });
            expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
            expect(google.maps.Geocoder).toHaveBeenCalled();
        });
    });
    describe('store', () => {
        beforeEach(() => {
            cct.datacenters = [
                {
                    id: 'dc1',
                    latencies: new Array(20),
                    bandwidths: new Array(20),
                    storedLatencyCount: 0,
                    storedBandwidthCount: 0,
                },
            ];
        });
        it('should return false if no location is provided', async () => {
            const result = await cct.store();
            expect(result).toBe(false);
        });
        it('should return false if no datacenter meets the criteria for saving', async () => {
            cct.datacenters[0].latencies = [];
            const result = await cct.store({ address: 'Test Address', latitude: 10, longitude: 20 });
            expect(result).toBe(false);
        });
        it('should send data to the server when there are datacenters with enough new measurements', async () => {
            node_fetch_1.default.mockResolvedValue({
                json: () => Promise.resolve({ status: 'OK' }),
            });
            const location = { address: 'Test Address', latitude: 10, longitude: 20 };
            const result = await cct.store(location);
            expect(result).toBe(true);
            expect(node_fetch_1.default).toHaveBeenCalledWith('https://cct.demo-education.cloud.sap/measurement', expect.objectContaining({
                method: 'post',
                body: expect.any(String),
                headers: { 'Content-Type': 'application/json' },
            }));
            expect(cct.datacenters[0].storedLatencyCount).toBe(20);
            expect(cct.datacenters[0].storedBandwidthCount).toBe(20);
        });
        it('should return false if the fetch operation fails', async () => {
            node_fetch_1.default.mockResolvedValue({
                json: () => Promise.reject(new Error('error')),
            });
            const location = { address: 'Test Address', latitude: 10, longitude: 20 };
            const result = await cct.store(location);
            expect(result).toBe(false);
        });
    });
    describe('clean', () => {
        beforeEach(() => {
            cct.datacenters = [
                {
                    id: 'dc1',
                    position: 5,
                    averageLatency: 100,
                    averageBandwidth: { bitsPerSecond: 5000, kiloBitsPerSecond: 5, megaBitsPerSecond: 0.005 },
                    latencies: new Array(20),
                    bandwidths: new Array(20),
                    bandwidthJudgement: Datacenter_1.Speed.good,
                    latencyJudgement: Datacenter_1.Speed.good,
                    storedBandwidthCount: 2,
                    storedLatencyCount: 2,
                },
                {
                    id: 'dc2',
                    position: 3,
                    averageLatency: 200,
                    averageBandwidth: { bitsPerSecond: 10000, kiloBitsPerSecond: 10, megaBitsPerSecond: 0.01 },
                    latencies: new Array(20),
                    bandwidths: new Array(20),
                    bandwidthJudgement: Datacenter_1.Speed.good,
                    latencyJudgement: Datacenter_1.Speed.good,
                    storedBandwidthCount: 4,
                    storedLatencyCount: 4,
                },
            ];
        });
        it('should reset all specified properties for every datacenter to their initial values', () => {
            cct.clean();
            cct.datacenters.forEach((dc) => {
                expect(dc.position).toBe(0);
                expect(dc.averageLatency).toBe(0);
                expect(dc.averageBandwidth).toEqual({ bitsPerSecond: 0, kiloBitsPerSecond: 0, megaBitsPerSecond: 0 });
                expect(dc.latencies).toEqual([]);
                expect(dc.bandwidths).toEqual([]);
                expect(dc.bandwidthJudgement).toBe(Datacenter_1.Speed.nothing);
                expect(dc.latencyJudgement).toBe(Datacenter_1.Speed.nothing);
                expect(dc.storedBandwidthCount).toBe(0);
                expect(dc.storedLatencyCount).toBe(0);
            });
        });
    });
    describe('startMeasurements', () => {
        let mockAbortController;
        let mockConfig;
        beforeEach(() => {
            cct = new CCT_1.CCT();
            cct.datacenters = [
                { id: 'dc1', name: 'Datacenter1' },
                { id: 'dc2', name: 'Datacenter2' },
            ];
            cct.compatibleDCsWithSockets = cct.datacenters;
            mockAbortController = new AbortController();
            jest.spyOn(mockAbortController.signal, 'addEventListener');
            mockConfig = {
                latency: {
                    endEvent: 'LATENCY_END',
                },
                bandwidth: {
                    endEvent: 'BANDWIDTH_END',
                },
            };
            cct.measurementConfigs = mockConfig;
            jest.spyOn(cct, 'startCloudMeasurements').mockResolvedValue();
            jest.spyOn(cct, 'startLocalMeasurements').mockResolvedValue();
            jest.spyOn(cct, 'emit').mockImplementation();
        });
        it('should correctly initiate and complete latency measurements', async () => {
            const params = { from: 'dc1' };
            await cct.startMeasurements('latency', params, mockAbortController);
            expect(cct.abortControllers.includes(mockAbortController)).toBe(true);
            expect(cct.startCloudMeasurements).toHaveBeenCalledWith(mockConfig.latency, params, cct.datacenters[0], mockAbortController);
            expect(cct.runningLatency).toBe(false);
            expect(cct.emit).toHaveBeenCalledWith('LATENCY_END');
        });
        it('should correctly initiate and complete bandwidth measurements without specific datacenter', async () => {
            const params = {};
            await cct.startMeasurements('bandwidth', params, mockAbortController);
            expect(cct.abortControllers.includes(mockAbortController)).toBe(true);
            expect(cct.startLocalMeasurements).toHaveBeenCalledWith(mockConfig.bandwidth, params, mockAbortController);
            expect(cct.runningBandwidth).toBe(false);
            expect(cct.emit).toHaveBeenCalledWith('BANDWIDTH_END');
        });
        it('should not emit the end event if the measurement process is aborted', async () => {
            mockAbortController = new AbortController();
            mockAbortController.abort();
            await cct.startMeasurements('latency', {}, mockAbortController);
            expect(cct.runningLatency).toBe(true);
            expect(cct.emit).not.toHaveBeenCalledWith('LATENCY_END');
        });
    });
    describe('startLocalMeasurements', () => {
        let mockConfig;
        let mockParams;
        let mockAbortController;
        beforeEach(() => {
            cct.datacenters = [{ id: 'dc1' }, { id: 'dc2' }];
            mockConfig = {
                iterationEvent: 'ITERATION_EVENT',
            };
            mockParams = { iterations: 2, interval: 1000 };
            mockAbortController = new AbortController();
            jest.spyOn(cct, 'startMeasurementFor').mockResolvedValue({});
            jest.spyOn(cct, 'emit').mockImplementation();
            jest.spyOn(Util_1.Util, 'sleep').mockResolvedValue();
            jest.useFakeTimers();
        });
        afterEach(() => {
            jest.useRealTimers();
        });
        it('should perform local measurements for the specified number of iterations', async () => {
            await cct.startLocalMeasurements(mockConfig, mockParams, mockAbortController);
            expect(cct.startMeasurementFor).toHaveBeenCalledTimes(cct.datacenters.length * mockParams.iterations);
            expect(cct.emit).toHaveBeenCalledTimes(mockParams.iterations);
            expect(Util_1.Util.sleep).toHaveBeenCalledTimes(mockParams.iterations);
        });
        it('should abort measurements if the abort signal is triggered', async () => {
            const promise = cct.startLocalMeasurements(mockConfig, mockParams, mockAbortController);
            mockAbortController.abort();
            await promise;
            expect(mockAbortController.signal.aborted).toBeTruthy();
            expect(cct.emit).not.toHaveBeenCalledWith(mockConfig.iterationEvent, expect.anything());
        });
        it('should emit the correct event with measurement data after each iteration', async () => {
            await cct.startLocalMeasurements(mockConfig, { iterations: 1 }, mockAbortController);
            expect(cct.emit).toHaveBeenCalledWith(mockConfig.iterationEvent, expect.anything());
        });
    });
    describe('handleEventData', () => {
        let getAverageLatencySpy;
        let judgeLatencySpy;
        let getAverageBandwidthSpy;
        let judgeBandwidthSpy;
        beforeEach(() => {
            cct.datacenters = [{ id: 'dc1', latencies: [], bandwidths: [] }];
            getAverageLatencySpy = jest.spyOn(Util_1.Util, 'getAverageLatency').mockReturnValue(100);
            judgeLatencySpy = jest.spyOn(Util_1.Util, 'judgeLatency').mockReturnValue(Datacenter_1.Speed.good);
            getAverageBandwidthSpy = jest.spyOn(Util_1.Util, 'getAverageBandwidth').mockReturnValue({
                bitsPerSecond: 1000,
                kiloBitsPerSecond: 1,
                megaBitsPerSecond: 0.001,
            });
            judgeBandwidthSpy = jest.spyOn(Util_1.Util, 'judgeBandwidth').mockReturnValue(Datacenter_1.Speed.good);
        });
        it('should handle latency event data correctly and update datacenter records', () => {
            const eventData = { id: 'dc1', data: { value: 10, timestamp: 10 } };
            cct.handleEventData(eventData, true, 'latency');
            expect(cct.datacenters[0].latencies).toContainEqual(eventData.data);
            expect(getAverageLatencySpy).toHaveBeenCalledWith(expect.anything());
            expect(judgeLatencySpy).toHaveBeenCalledWith(expect.anything());
            expect(cct.datacenters[0].latencyJudgement).toBe(Datacenter_1.Speed.good);
        });
        it('should handle bandwidth event data correctly and update datacenter records', () => {
            const eventData = {
                id: 'dc1',
                data: { value: { bitsPerSecond: 1000, kiloBitsPerSecond: 1, megaBitsPerSecond: 0.001 }, timestamp: 10 },
            };
            cct.handleEventData(eventData, true, 'bandwidth');
            expect(cct.datacenters[0].bandwidths).toContainEqual(eventData.data);
            expect(getAverageBandwidthSpy).toHaveBeenCalledWith(expect.anything());
            expect(judgeBandwidthSpy).toHaveBeenCalledWith(expect.anything());
            expect(cct.datacenters[0].bandwidthJudgement).toBe(Datacenter_1.Speed.good);
        });
        it('should not update datacenter records if save flag is false', () => {
            const eventData = { id: 'dc1', data: { value: 100, timestamp: 10 } };
            cct.handleEventData(eventData, false, 'latency');
            expect(cct.datacenters[0].latencies).toHaveLength(0);
        });
        it('should do nothing if datacenter ID does not match any records', () => {
            const eventData = { id: 'nonexistent', data: { value: 100, timestamp: 10 } };
            cct.handleEventData(eventData, true, 'latency');
            expect(cct.datacenters[0].latencies).toHaveLength(0);
        });
    });
});
//# sourceMappingURL=CCT.test.js.map