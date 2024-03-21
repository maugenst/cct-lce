"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LCE_1 = require("../app/LCE");
const Shared_1 = require("../@types/Shared");
const abort_controller_1 = require("abort-controller");
jest.mock('node-fetch', () => {
    const originalModule = jest.requireActual('node-fetch');
    return {
        __esModule: true,
        default: jest.fn().mockImplementation(originalModule.default),
        Response: originalModule.Response,
    };
});
const node_fetch_1 = require("node-fetch");
describe('LCE', () => {
    let instance;
    beforeEach(() => {
        instance = new LCE_1.LCE();
        jest.clearAllMocks();
    });
    describe('Network operations', () => {
        describe('checkIfCompatibleWithSockets', () => {
            const mockLatencyFetch = jest.spyOn(LCE_1.LCE.prototype, 'latencyFetch');
            const mockIsSemverVersionHigher = jest.spyOn(LCE_1.LCE.prototype, 'isSemverVersionHigher');
            it('should return true if drone version is higher', async () => {
                mockLatencyFetch.mockResolvedValue({
                    headers: {
                        get: jest.fn().mockReturnValueOnce('2.0.0'),
                    },
                });
                mockIsSemverVersionHigher.mockReturnValueOnce(true);
                const result = await instance.checkIfCompatibleWithSockets('192.168.1.1');
                expect(result).toBeTruthy();
                expect(mockLatencyFetch).toHaveBeenCalledWith('https://192.168.1.1/drone/index.html');
                expect(mockIsSemverVersionHigher).toHaveBeenCalledWith('2.0.0');
            });
            it('should return false if drone version header is missing', async () => {
                mockLatencyFetch.mockResolvedValue({
                    headers: {
                        get: jest.fn().mockReturnValueOnce(null),
                    },
                });
                const result = await instance.checkIfCompatibleWithSockets('192.168.1.1');
                expect(result).toBeFalsy();
                expect(mockLatencyFetch).toHaveBeenCalledWith('https://192.168.1.1/drone/index.html');
            });
        });
        describe('getLatencyFor', () => {
            const mockLatencyFetch = jest.spyOn(LCE_1.LCE.prototype, 'latencyFetch');
            it('should measure and return latency for fetch operation', async () => {
                mockLatencyFetch.mockResolvedValueOnce(new Promise((resolve) => setTimeout(resolve, 10)));
                const datacenter = { ip: '192.168.1.1' };
                const start = Date.now();
                const result = await instance.getLatencyFor(datacenter);
                const end = Date.now();
                const marginOfError = 3;
                expect(result.value).toBeGreaterThanOrEqual(10);
                expect(result.value).toBeLessThanOrEqual(end - start + marginOfError);
                expect(result.timestamp).toBeGreaterThanOrEqual(start);
                expect(result.timestamp).toBeLessThanOrEqual(end + marginOfError);
                expect(mockLatencyFetch).toHaveBeenCalledWith(`https://${datacenter.ip}/drone/index.html`);
            });
        });
        describe('getBandwidthFor', () => {
            const mockBandwidthFetch = jest.spyOn(LCE_1.LCE.prototype, 'bandwidthFetch');
            const mockCalcBandwidth = jest.spyOn(LCE_1.LCE.prototype, 'calcBandwidth');
            it('should calculate bandwidth for big mode', async () => {
                const fakeResponse = { text: () => Promise.resolve('Some long response body') };
                mockBandwidthFetch.mockResolvedValueOnce(fakeResponse);
                mockCalcBandwidth.mockReturnValueOnce({ a: 1 });
                const datacenter = { ip: '192.168.1.1' };
                const result = await instance.getBandwidthFor(datacenter, Shared_1.BandwidthMode.big);
                expect(mockBandwidthFetch).toHaveBeenCalledWith(`https://${datacenter.ip}/drone/big`);
                expect(result).toEqual({ value: { a: 1 }, timestamp: expect.any(Number) });
            });
            it('should return null if fetch fails', async () => {
                mockBandwidthFetch.mockResolvedValueOnce(null);
                const datacenter = { ip: '192.168.1.2' };
                const result = await instance.getBandwidthFor(datacenter);
                expect(result).toBeNull();
            });
            it('should return null if response text cannot be read', async () => {
                const fakeResponse = {
                    text: () => Promise.reject(new Error('Failed to read response body')),
                };
                mockBandwidthFetch.mockResolvedValueOnce(fakeResponse);
                const datacenter = { ip: '192.168.1.3' };
                const result = await instance.getBandwidthFor(datacenter);
                expect(result).toBeNull();
            });
        });
        describe('abortableFetch', () => {
            beforeEach(() => {
                node_fetch_1.default.mockClear();
            });
            it('completes the fetch request successfully before timeout', async () => {
                const mockResponse = new Response('OK', { status: 200 });
                node_fetch_1.default.mockResolvedValue(mockResponse);
                const controller = new abort_controller_1.default();
                const url = 'https://example.com/data';
                jest.useFakeTimers();
                const resultPromise = instance.abortableFetch(url, controller);
                jest.runAllTimers();
                const result = await resultPromise;
                expect(node_fetch_1.default).toHaveBeenCalledWith(expect.stringContaining(url), expect.objectContaining({ signal: expect.any(Object) }));
                expect(result).toBeInstanceOf(Response);
                jest.useRealTimers();
            });
            it('returns null when fetch is aborted due to timeout', async () => {
                node_fetch_1.default.mockImplementation(({ signal }) => {
                    return new Promise((_resolve, reject) => {
                        if (signal.aborted) {
                            reject(new Error('error'));
                        }
                    });
                });
                const controller = new abort_controller_1.default();
                const url = 'https://example.com/timeout';
                jest.useFakeTimers();
                controller.signal.addEventListener('abort', () => {
                    jest.runOnlyPendingTimers();
                });
                const resultPromise = instance.abortableFetch(url, controller);
                jest.advanceTimersByTime(3000);
                let result;
                try {
                    result = await resultPromise;
                }
                catch (e) {
                    result = null;
                }
                expect(node_fetch_1.default).toHaveBeenCalledWith(expect.stringContaining(url), expect.objectContaining({ signal: expect.any(Object) }));
                expect(controller.signal.aborted).toBeTruthy();
                expect(result).toBeNull();
                jest.useRealTimers();
            });
            it('returns null if fetch operation fails', async () => {
                node_fetch_1.default.mockRejectedValue(new Error('Network error'));
                const controller = new abort_controller_1.default();
                const url = 'https://example.com/fail';
                const result = await instance.abortableFetch(url, controller);
                expect(node_fetch_1.default).toHaveBeenCalledWith(expect.stringContaining(url), expect.objectContaining({ signal: expect.any(Object) }));
                expect(result).toBeNull();
            });
        });
    });
    describe('Utility methods', () => {
        describe('compare', () => {
            it('returns -1 if the latency of a is less than the latency of b', () => {
                const a = { latency: 10 };
                const b = { latency: 20 };
                expect(instance.compare(a, b)).toBe(-1);
            });
            it('returns 1 if the latency of a is greater than the latency of b', () => {
                const a = { latency: 30 };
                const b = { latency: 20 };
                expect(instance.compare(a, b)).toBe(1);
            });
            it('returns 0 if the latencies of a and b are equal', () => {
                const a = { latency: 20 };
                const b = { latency: 20 };
                expect(instance.compare(a, b)).toBe(0);
            });
        });
    });
    describe('terminate', () => {
        it('calls abort on all cancelableLatencyRequests and cancelableBandwidthRequests', () => {
            instance.cancelableLatencyRequests = [new abort_controller_1.default(), new abort_controller_1.default()];
            instance.cancelableBandwidthRequests = [new abort_controller_1.default(), new abort_controller_1.default()];
            instance.cancelableLatencyRequests.forEach((controller) => jest.spyOn(controller, 'abort'));
            instance.cancelableBandwidthRequests.forEach((controller) => jest.spyOn(controller, 'abort'));
            instance.terminate();
            instance.cancelableLatencyRequests.forEach((controller) => {
                expect(controller.abort).toHaveBeenCalled();
            });
            instance.cancelableBandwidthRequests.forEach((controller) => {
                expect(controller.abort).toHaveBeenCalled();
            });
            expect(instance.cancelableLatencyRequests).toEqual([]);
            expect(instance.cancelableBandwidthRequests).toEqual([]);
        });
    });
    describe('calcBandwidth', () => {
        it('correctly calculates bandwidth for given download size and latency', () => {
            const downloadSize = 1000;
            const latency = 1000;
            const result = instance.calcBandwidth(downloadSize, latency);
            expect(result.bitsPerSecond).toBe(8000);
            expect(result.kiloBitsPerSecond).toBe(8);
            expect(result.megaBitsPerSecond).toBe(0.008);
        });
    });
    describe('isSemverVersionHigher', () => {
        it('correctly compares versions when custom base version is provided', () => {
            expect(instance.isSemverVersionHigher('0.9.9', '1.0.0')).toBeFalsy();
            expect(instance.isSemverVersionHigher('1.0.0', '0.9.9')).toBeTruthy();
            expect(instance.isSemverVersionHigher('0.9.9', '0.9.9')).toBeTruthy();
        });
    });
});
//# sourceMappingURL=LCE.test.js.map