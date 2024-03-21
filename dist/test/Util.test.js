"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("../app/Util");
const Datacenter_1 = require("../@types/Datacenter");
describe('Util', () => {
    describe('getAverageLatency', () => {
        it('should return the average latency correctly', () => {
            const latencies = [{ value: 100 }, { value: 200 }, { value: 300 }];
            const result = Util_1.Util.getAverageLatency(latencies);
            expect(result).toBe(200);
        });
        it('should return -1 if the data is undefined or empty', () => {
            expect(Util_1.Util.getAverageLatency(undefined)).toBe(-1);
            expect(Util_1.Util.getAverageLatency([])).toBe(-1);
        });
        it('should calculate average latency starting from a specified index', () => {
            const latencies = [{ value: 100 }, { value: 200 }, { value: 300 }];
            const result = Util_1.Util.getAverageLatency(latencies, 1);
            expect(result).toBe(250);
        });
    });
    describe('getAverageBandwidth', () => {
        it('should return the average bandwidth correctly', () => {
            const bandwidths = [
                { value: { bitsPerSecond: 1000, kiloBitsPerSecond: 1, megaBitsPerSecond: 0.001 } },
                { value: { bitsPerSecond: 2000, kiloBitsPerSecond: 2, megaBitsPerSecond: 0.002 } },
            ];
            const result = Util_1.Util.getAverageBandwidth(bandwidths);
            expect(result).toEqual({ bitsPerSecond: 1500, kiloBitsPerSecond: 1.5, megaBitsPerSecond: 0.0015 });
        });
        it('should return negative values if the data is undefined or empty', () => {
            expect(Util_1.Util.getAverageBandwidth(undefined)).toEqual({
                bitsPerSecond: -1,
                kiloBitsPerSecond: -1,
                megaBitsPerSecond: -1,
            });
            expect(Util_1.Util.getAverageBandwidth([])).toEqual({
                bitsPerSecond: -1,
                kiloBitsPerSecond: -1,
                megaBitsPerSecond: -1,
            });
        });
    });
    describe('sortDatacenters', () => {
        it('should sort datacenters by average latency', () => {
            const datacenters = [
                { id: 'dc1', averageLatency: 200 },
                { id: 'dc2', averageLatency: 100 },
                { id: 'dc3', averageLatency: 300 },
            ];
            const sorted = Util_1.Util.sortDatacenters(datacenters);
            expect(sorted.map((dc) => dc.id)).toEqual(['dc2', 'dc1', 'dc3']);
        });
    });
    describe('getTop3', () => {
        it('should return the top 3 datacenters sorted by average latency', () => {
            const datacenters = [
                { id: 'dc1', averageLatency: 200 },
                { id: 'dc2', averageLatency: 100 },
                { id: 'dc3', averageLatency: 300 },
                { id: 'dc4', averageLatency: 50 },
            ];
            const top3 = Util_1.Util.getTop3(datacenters);
            expect(top3.map((dc) => dc.id)).toEqual(['dc4', 'dc2', 'dc1']);
        });
    });
    describe('sleep', () => {
        beforeAll(() => {
            jest.useFakeTimers();
        });
        afterAll(() => {
            jest.useRealTimers();
        });
        it('should resolve after the specified duration', async () => {
            const controller = new AbortController();
            const sleepPromise = Util_1.Util.sleep(1000, controller);
            jest.advanceTimersByTime(1000);
            await expect(sleepPromise).resolves.toBeUndefined();
        });
        it('should resolve immediately if the abort signal is triggered', async () => {
            const controller = new AbortController();
            const sleepPromise = Util_1.Util.sleep(1000, controller);
            controller.abort();
            jest.advanceTimersByTime(500);
            await expect(sleepPromise).resolves.toBeUndefined();
            jest.advanceTimersByTime(500);
            await expect(sleepPromise).resolves.toBeUndefined();
        });
    });
    describe('judgeLatency', () => {
        it('should judge latency as good, ok, or bad', () => {
            expect(Util_1.Util.judgeLatency(100)).toBe(Datacenter_1.Speed.good);
            expect(Util_1.Util.judgeLatency(200)).toBe(Datacenter_1.Speed.ok);
            expect(Util_1.Util.judgeLatency(300)).toBe(Datacenter_1.Speed.bad);
        });
    });
    describe('judgeBandwidth', () => {
        it('should judge bandwidth as good, ok, or bad', () => {
            expect(Util_1.Util.judgeBandwidth({ megaBitsPerSecond: 2 })).toBe(Datacenter_1.Speed.good);
            expect(Util_1.Util.judgeBandwidth({ megaBitsPerSecond: 0.5 })).toBe(Datacenter_1.Speed.ok);
            expect(Util_1.Util.judgeBandwidth({ megaBitsPerSecond: 0.2 })).toBe(Datacenter_1.Speed.bad);
        });
    });
});
//# sourceMappingURL=Util.test.js.map