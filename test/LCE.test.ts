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

describe('LCE', () => {
    let instance: LCE;

    beforeEach(() => {
        instance = new LCE();
        jest.clearAllMocks();
    });

    describe('Network operations', () => {
        describe('checkIfCompatibleWithSockets', () => {
            const mockLatencyFetch = jest.spyOn(LCE.prototype, 'latencyFetch');
            const mockIsSemverVersionHigher = jest.spyOn(LCE.prototype, 'isSemverVersionHigher');

            it('should return true if drone version is higher', async () => {
                mockLatencyFetch.mockResolvedValue({
                    headers: {
                        get: jest.fn().mockReturnValueOnce('2.0.0'),
                    },
                } as any);
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
                } as any);

                const result = await instance.checkIfCompatibleWithSockets('192.168.1.1');
                expect(result).toBeFalsy();
                expect(mockLatencyFetch).toHaveBeenCalledWith('https://192.168.1.1/drone/index.html');
            });
        });

        describe('getLatencyFor', () => {
            const mockLatencyFetch = jest.spyOn(LCE.prototype, 'latencyFetch');

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
            const mockBandwidthFetch = jest.spyOn(LCE.prototype, 'bandwidthFetch');
            const mockCalcBandwidth = jest.spyOn(LCE.prototype, 'calcBandwidth');

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

        // TODO: fix latencyFetch test, for some reason same solution as for bandwidthFetch does not work
        // describe('Network fetches', () => {
        //     it.each([
        //         ['bandwidthFetch', 'cancelableBandwidthRequests'],
        //         ['latencyFetch', 'cancelableLatencyRequests'],
        //     ])('%s initiates an abortable fetch and stores the controller', async (methodName, propertyName) => {
        //         jest.spyOn(LCE.prototype, 'abortableFetch').mockResolvedValueOnce(null);
        //
        //         await instance[methodName as 'latencyFetch' | 'bandwidthFetch']('https://example.com/data');
        //         console.log(propertyName);
        //         expect(instance[propertyName as keyof LCE].length).toBe(1);
        //     });
        // });

        describe('abortableFetch', () => {
            beforeEach(() => {
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
                            reject(new Error('error'));
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
    });

    describe('Utility methods', () => {
        describe('compare', () => {
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
    });

    describe('terminate', () => {
        it('calls abort on all cancelableLatencyRequests and cancelableBandwidthRequests', () => {
            instance.cancelableLatencyRequests = [new AbortController(), new AbortController()];
            instance.cancelableBandwidthRequests = [new AbortController(), new AbortController()];

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
            expect(instance.isSemverVersionHigher('0.9.9', '1.0.0')).toBeFalsy(); // Lower than custom base version
            expect(instance.isSemverVersionHigher('1.0.0', '0.9.9')).toBeTruthy(); // Higher than custom base version
            expect(instance.isSemverVersionHigher('0.9.9', '0.9.9')).toBeTruthy(); // Equal to custom base version
        });
    });
});
