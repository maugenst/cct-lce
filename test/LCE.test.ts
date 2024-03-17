import {LCE} from '../app/LCE';
import {Datacenter} from '../@types/Datacenter';
import {BandwidthMode} from '../@types/Shared';
import AbortController from 'abort-controller';
jest.mock('node-fetch', () => {
    const originalModule = jest.requireActual('node-fetch');
    return {
        __esModule: true, // Correctly handle ES Module interop
        default: jest.fn().mockImplementation(originalModule.default), // Mock fetch and allow for custom implementation per test case
        Response: originalModule.Response, // Use the actual Response class for constructing response objects
    };
});

import fetch from 'node-fetch';
describe('lce-tests', () => {
    describe('checkIfCompatibleWithSockets', () => {
        let instance: LCE;
        const mockLatencyFetch = jest.spyOn(LCE.prototype, 'latencyFetch');
        const mockIsSemverVersionHigher = jest.spyOn(LCE.prototype, 'isSemverVersionHigher');

        beforeEach(() => {
            instance = new LCE();
            mockLatencyFetch.mockClear();
            mockIsSemverVersionHigher.mockClear();
        });

        it('should return true if drone version is higher', async () => {
            mockLatencyFetch.mockResolvedValue({
                headers: {
                    get: jest.fn().mockReturnValue('2.0.0'),
                },
            } as any);
            mockIsSemverVersionHigher.mockReturnValue(true);

            const result = await instance.checkIfCompatibleWithSockets('192.168.1.1');
            expect(result).toBeTruthy();
            expect(mockLatencyFetch).toHaveBeenCalledWith('https://192.168.1.1/drone/index.html');
            expect(mockIsSemverVersionHigher).toHaveBeenCalledWith('2.0.0');
        });

        it('should return false if drone version header is missing', async () => {
            mockLatencyFetch.mockResolvedValue({
                headers: {
                    get: jest.fn().mockReturnValue(null),
                },
            } as any);

            const result = await instance.checkIfCompatibleWithSockets('192.168.1.1');
            expect(result).toBeFalsy();
            expect(mockLatencyFetch).toHaveBeenCalledWith('https://192.168.1.1/drone/index.html');
        });
    });

    describe('getLatencyFor', () => {
        let instance: LCE;
        const mockLatencyFetch = jest.spyOn(LCE.prototype, 'latencyFetch');

        beforeEach(() => {
            instance = new LCE();
            mockLatencyFetch.mockClear();
        });

        it('should measure and return latency for fetch operation', async () => {
            mockLatencyFetch.mockResolvedValueOnce(new Promise((resolve) => setTimeout(resolve, 10)));

            const datacenter = {ip: '192.168.1.1'};
            const start = Date.now();
            const result = await instance.getLatencyFor(datacenter as Datacenter);
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
        let instance: LCE;
        const mockBandwidthFetch = jest.spyOn(LCE.prototype, 'bandwidthFetch');
        const mockCalcBandwidth = jest.spyOn(LCE.prototype, 'calcBandwidth');

        beforeEach(() => {
            instance = new LCE();
            mockBandwidthFetch.mockClear();
            mockCalcBandwidth.mockClear();
        });

        it('should calculate bandwidth for big mode', async () => {
            const fakeResponse = {text: () => Promise.resolve('Some long response body')};
            mockBandwidthFetch.mockResolvedValueOnce(fakeResponse as any);
            mockCalcBandwidth.mockReturnValueOnce({a: 1} as any); // Simulate bandwidth calculation result

            const datacenter = {ip: '192.168.1.1'};
            const result = await instance.getBandwidthFor(datacenter as Datacenter, BandwidthMode.big);

            expect(mockBandwidthFetch).toHaveBeenCalledWith(`https://${datacenter.ip}/drone/big`);
            expect(result).toEqual({value: {a: 1}, timestamp: expect.any(Number)});
        });

        it('should return null if fetch fails', async () => {
            mockBandwidthFetch.mockResolvedValueOnce(null);

            const datacenter = {ip: '192.168.1.2'};
            const result = await instance.getBandwidthFor(datacenter as Datacenter);

            expect(result).toBeNull();
        });

        it('should return null if response text cannot be read', async () => {
            const fakeResponse = {
                text: () => Promise.reject(new Error('Failed to read response body')),
            };
            mockBandwidthFetch.mockResolvedValueOnce(fakeResponse as any);

            const datacenter = {ip: '192.168.1.3'};
            const result = await instance.getBandwidthFor(datacenter as Datacenter);

            expect(result).toBeNull();
        });
    });

    describe('latencyFetch', () => {
        let instance: LCE;
        const mockAbortableFetch = jest.fn();

        beforeEach(() => {
            instance = new LCE();
            instance.abortableFetch = mockAbortableFetch;
        });

        it('initiates an abortable fetch and stores the controller', async () => {
            const testUrl = 'https://example.com/data';

            await instance.latencyFetch(testUrl);

            expect(mockAbortableFetch).toHaveBeenCalledWith(testUrl, expect.any(Object));
            expect(instance.cancelableLatencyRequests.length).toBe(1);
        });
    });

    describe('bandwidthFetch', () => {
        let instance: LCE;
        const mockAbortableFetch = jest.fn();

        beforeEach(() => {
            instance = new LCE();
            instance.abortableFetch = mockAbortableFetch;
        });

        it('initiates an abortable fetch and stores the controller', async () => {
            const testUrl = 'https://example.com/data';

            await instance.bandwidthFetch(testUrl);

            expect(mockAbortableFetch).toHaveBeenCalledWith(testUrl, expect.any(Object));
            expect(instance.cancelableBandwidthRequests.length).toBe(1);
        });
    });

    describe('abortableFetch', () => {
        let instance: LCE;

        beforeEach(() => {
            jest.clearAllMocks();
            instance = new LCE();
            (fetch as any).mockClear();
        });

        it('completes the fetch request successfully before timeout', async () => {
            const mockResponse = new Response('OK', {status: 200});
            (fetch as any).mockResolvedValue(mockResponse);

            const controller = new AbortController();
            const url = 'https://example.com/data';

            jest.useFakeTimers();
            const resultPromise = instance.abortableFetch(url, controller);
            jest.runAllTimers();
            const result = await resultPromise;

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining(url),
                expect.objectContaining({signal: expect.any(Object)})
            );
            expect(result).toBeInstanceOf(Response);
            jest.useRealTimers();
        });

        it('returns null when fetch is aborted due to timeout', async () => {
            (fetch as any).mockImplementation(({signal}: any) => {
                return new Promise((_resolve, reject) => {
                    if (signal.aborted) {
                        reject(new DOMException('The operation was aborted.', 'AbortError'));
                    }
                });
            });

            const controller = new AbortController();
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
            } catch (e) {
                result = null;
            }

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining(url),
                expect.objectContaining({signal: expect.any(Object)})
            );
            expect(controller.signal.aborted).toBeTruthy();
            expect(result).toBeNull();

            jest.useRealTimers();
        });

        it('returns null if fetch operation fails', async () => {
            (fetch as any).mockRejectedValue(new Error('Network error'));
            const controller = new AbortController();
            const url = 'https://example.com/fail';

            const result = await instance.abortableFetch(url, controller);

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining(url),
                expect.objectContaining({signal: expect.any(Object)})
            );
            expect(result).toBeNull();
        });
    });

    describe('compare', () => {
        let instance: LCE;

        beforeEach(() => {
            instance = new LCE(); // Replace YourClassName with the actual class name containing the compare method
        });

        it('returns -1 if the latency of a is less than the latency of b', () => {
            const a = {latency: 10};
            const b = {latency: 20};
            expect(instance.compare(a, b)).toBe(-1);
        });

        it('returns 1 if the latency of a is greater than the latency of b', () => {
            const a = {latency: 30};
            const b = {latency: 20};
            expect(instance.compare(a, b)).toBe(1);
        });

        it('returns 0 if the latencies of a and b are equal', () => {
            const a = {latency: 20};
            const b = {latency: 20};
            expect(instance.compare(a, b)).toBe(0);
        });
    });

    describe('terminate', () => {
        let instance: LCE;

        beforeEach(() => {
            instance = new LCE(); // Replace YourClassName with the actual class name
            // Mocking AbortController instances
            instance.cancelableLatencyRequests = [new AbortController(), new AbortController()];
            instance.cancelableBandwidthRequests = [new AbortController(), new AbortController()];
            // Spying on abort method of all controllers
            instance.cancelableLatencyRequests.forEach((controller) => jest.spyOn(controller, 'abort'));
            instance.cancelableBandwidthRequests.forEach((controller) => jest.spyOn(controller, 'abort'));
        });

        it('calls abort on all cancelableLatencyRequests and cancelableBandwidthRequests', () => {
            instance.terminate();

            instance.cancelableLatencyRequests.forEach((controller) => {
                expect(controller.abort).toHaveBeenCalled();
            });
            instance.cancelableBandwidthRequests.forEach((controller) => {
                expect(controller.abort).toHaveBeenCalled();
            });
        });

        it('empties the cancelableLatencyRequests and cancelableBandwidthRequests arrays', () => {
            instance.terminate();

            expect(instance.cancelableLatencyRequests).toEqual([]);
            expect(instance.cancelableBandwidthRequests).toEqual([]);
        });
    });

    describe('calcBandwidth', () => {
        let instance: LCE;

        beforeEach(() => {
            instance = new LCE(); // Replace YourClassName with the actual class name containing the calcBandwidth method
        });

        it('correctly calculates bandwidth for given download size and latency', () => {
            // Example: 1000 bytes downloaded over 1000 milliseconds (1 second)
            const downloadSize = 1000; // bytes
            const latency = 1000; // milliseconds

            const result = instance.calcBandwidth(downloadSize, latency);

            // 1000 bytes * 8 = 8000 bits, over 1 second = 8000 bits per second
            expect(result.bitsPerSecond).toBe(8000);
            expect(result.kiloBitsPerSecond).toBe(8);
            expect(result.megaBitsPerSecond).toBe(0.008);
        });
    });

    describe('isSemverVersionHigher', () => {
        let instance: LCE;

        it('correctly compares versions when custom base version is provided', () => {
            instance = new LCE();
            expect(instance.isSemverVersionHigher('1.0.0', '0.9.9')).toBeTruthy(); // Higher than custom base version
            expect(instance.isSemverVersionHigher('0.9.8', '0.9.9')).toBeFalsy(); // Lower than custom base version
            expect(instance.isSemverVersionHigher('0.9.9', '0.9.9')).toBeTruthy(); // Equal to custom base version
        });
    });
});
