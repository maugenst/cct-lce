import {Util} from '../app/Util';
import {Datacenter, Speed} from '../@types/Datacenter';
import {Latency} from '../@types/Latency';
import {Bandwidth, BandwidthPerSecond} from '../@types/Bandwidth';

describe('Util', () => {
    describe('getAverageLatency', () => {
        it('should return the average latency correctly', () => {
            const latencies: Latency[] = [{value: 100}, {value: 200}, {value: 300}] as Latency[];
            const result = Util.getAverageLatency(latencies);
            expect(result).toBe(200);
        });

        it('should return -1 if the data is undefined or empty', () => {
            expect(Util.getAverageLatency(undefined)).toBe(-1);
            expect(Util.getAverageLatency([])).toBe(-1);
        });

        it('should calculate average latency starting from a specified index', () => {
            const latencies: Latency[] = [{value: 100}, {value: 200}, {value: 300}] as Latency[];
            const result = Util.getAverageLatency(latencies, 1);
            expect(result).toBe(250);
        });
    });

    describe('getAverageBandwidth', () => {
        it('should return the average bandwidth correctly', () => {
            const bandwidths: Bandwidth[] = [
                {value: {bitsPerSecond: 1000, kiloBitsPerSecond: 1, megaBitsPerSecond: 0.001}},
                {value: {bitsPerSecond: 2000, kiloBitsPerSecond: 2, megaBitsPerSecond: 0.002}},
            ] as Bandwidth[];

            const result = Util.getAverageBandwidth(bandwidths);
            expect(result).toEqual({bitsPerSecond: 1500, kiloBitsPerSecond: 1.5, megaBitsPerSecond: 0.0015});
        });

        it('should return negative values if the data is undefined or empty', () => {
            expect(Util.getAverageBandwidth(undefined)).toEqual({
                bitsPerSecond: -1,
                kiloBitsPerSecond: -1,
                megaBitsPerSecond: -1,
            });
            expect(Util.getAverageBandwidth([])).toEqual({
                bitsPerSecond: -1,
                kiloBitsPerSecond: -1,
                megaBitsPerSecond: -1,
            });
        });
    });

    describe('sortDatacenters', () => {
        it('should sort datacenters by average latency', () => {
            const datacenters: Datacenter[] = [
                {id: 'dc1', averageLatency: 200},
                {id: 'dc2', averageLatency: 100},
                {id: 'dc3', averageLatency: 300},
            ] as Datacenter[];
            const sorted = Util.sortDatacenters(datacenters);
            expect(sorted.map((dc: Datacenter) => dc.id)).toEqual(['dc2', 'dc1', 'dc3']);
        });
    });

    describe('getTop3', () => {
        it('should return the top 3 datacenters sorted by average latency', () => {
            const datacenters: Datacenter[] = [
                {id: 'dc1', averageLatency: 200},
                {id: 'dc2', averageLatency: 100},
                {id: 'dc3', averageLatency: 300},
                {id: 'dc4', averageLatency: 50},
            ] as Datacenter[];
            const top3 = Util.getTop3(datacenters);
            expect(top3.map((dc: Datacenter) => dc.id)).toEqual(['dc4', 'dc2', 'dc1']);
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
            const sleepPromise = Util.sleep(1000, controller);

            jest.advanceTimersByTime(1000);

            await expect(sleepPromise).resolves.toBeUndefined();
        });

        it('should resolve immediately if the abort signal is triggered', async () => {
            const controller = new AbortController();
            const sleepPromise = Util.sleep(1000, controller);

            controller.abort();

            jest.advanceTimersByTime(500);

            await expect(sleepPromise).resolves.toBeUndefined();

            jest.advanceTimersByTime(500);
            await expect(sleepPromise).resolves.toBeUndefined();
        });
    });

    describe('judgeLatency', () => {
        it('should judge latency as good, ok, or bad', () => {
            expect(Util.judgeLatency(100)).toBe(Speed.good);
            expect(Util.judgeLatency(200)).toBe(Speed.ok);
            expect(Util.judgeLatency(300)).toBe(Speed.bad);
        });
    });

    describe('judgeBandwidth', () => {
        it('should judge bandwidth as good, ok, or bad', () => {
            expect(Util.judgeBandwidth({megaBitsPerSecond: 2} as BandwidthPerSecond)).toBe(Speed.good);
            expect(Util.judgeBandwidth({megaBitsPerSecond: 0.5} as BandwidthPerSecond)).toBe(Speed.ok);
            expect(Util.judgeBandwidth({megaBitsPerSecond: 0.2} as BandwidthPerSecond)).toBe(Speed.bad);
        });
    });
});
