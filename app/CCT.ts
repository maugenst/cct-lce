import {v4 as uuid} from 'uuid';
import fetch, {Response} from 'node-fetch';
import {EventEmitter} from 'events';
import {io, Socket} from 'socket.io-client';
import AbortController from 'abort-controller';

import {
    BandwidthChecksParams,
    CCTEvents,
    FilterKeys,
    LatencyChecksParams,
    Location,
    MeasurementConfig,
    MeasurementParams,
    MeasurementType,
    SocketEvents,
    StoreData,
} from '../@types/Shared';
import {Datacenter, Speed} from '../@types/Datacenter';
import {Bandwidth, BandwidthEventData} from '../@types/Bandwidth';
import {Latency, LatencyEventData} from '../@types/Latency';

import {LCE} from './LCE';
import {Util} from './Util';
import GeocoderResult = google.maps.GeocoderResult;

const defaultSocketConfig = {
    reconnectionAttempts: 3,
    timeout: 10000,
};

export class CCT extends EventEmitter {
    allDatacenters: Datacenter[] = [];
    datacenters: Datacenter[] = [];
    runningLatency = false;
    runningBandwidth = false;

    private idsToExclude: string[] = [];
    private compatibleDCsWithSockets: Datacenter[] = [];
    private filters?: FilterKeys;
    private lce = new LCE();
    private abortControllers: AbortController[] = [];
    private sockets: {[key in MeasurementType]: Socket | null} = {
        latency: null,
        bandwidth: null,
    };
    private measurementConfigs: {[key in MeasurementType]: MeasurementConfig<any>} = {
        latency: {
            type: 'latency',
            socketStartEvent: SocketEvents.LATENCY_START,
            socketEndEvent: SocketEvents.LATENCY_END,
            socketIterationEvent: SocketEvents.LATENCY_ITERATION,
            socketTickEvent: SocketEvents.LATENCY,
            iterationEvent: CCTEvents.LATENCY_ITERATION,
            tickEvent: CCTEvents.LATENCY,
            endEvent: CCTEvents.LATENCY_END,
            getMeasurementResult: (dc: Datacenter) => this.lce.getLatencyFor(dc),
        },
        bandwidth: {
            type: 'bandwidth',
            socketStartEvent: SocketEvents.BANDWIDTH_START,
            socketEndEvent: SocketEvents.BANDWIDTH_END,
            socketIterationEvent: SocketEvents.BANDWIDTH_ITERATION,
            socketTickEvent: SocketEvents.BANDWIDTH,
            iterationEvent: CCTEvents.BANDWIDTH_ITERATION,
            tickEvent: CCTEvents.BANDWIDTH,
            endEvent: CCTEvents.BANDWIDTH_END,
            getMeasurementResult: (dc: Datacenter, params: BandwidthChecksParams) =>
                this.lce.getBandwidthFor(dc, params.bandwidthMode),
        },
    };

    constructor() {
        super();
    }

    async fetchDatacenterInformationRequest(dictionaryUrl: string): Promise<Datacenter[]> {
        try {
            return (await fetch(dictionaryUrl).then((res: Response) => res.json())) as Datacenter[];
        } catch (e) {
            return [];
        }
    }

    async fetchDatacenterInformation(dictionaryUrl: string): Promise<void> {
        this.allDatacenters = await this.fetchDatacenterInformationRequest(dictionaryUrl);
        this.datacenters = this.allDatacenters;
        this.clean();
    }

    public async fetchCompatibleDCsWithSockets(): Promise<Datacenter[]> {
        const checks = await Promise.all(
            this.datacenters.map(async (dc) => ({
                dc,
                isCompatible: await this.lce.checkIfCompatibleWithSockets(dc.ip),
            }))
        );

        this.compatibleDCsWithSockets = checks.filter(({isCompatible}) => isCompatible).map(({dc}) => dc);

        return this.compatibleDCsWithSockets;
    }

    setFilters(filters?: FilterKeys): void {
        this.datacenters = filters
            ? this.allDatacenters.filter((dc) => {
                  if (this.idsToExclude.includes(dc.id)) {
                      return false;
                  }

                  return Object.keys(filters).every((key) => {
                      if (key === 'tags') {
                          return filters[key as keyof FilterKeys]!.some((tag) => {
                              return dc[key].toLowerCase().includes(tag.toLowerCase());
                          });
                      }

                      return filters[key as keyof FilterKeys]!.map((filterVal) => filterVal.toLowerCase()).includes(
                          dc[key as keyof FilterKeys]!.toLowerCase()
                      );
                  });
              })
            : this.allDatacenters.filter((dc) => !this.idsToExclude.includes(dc.id));

        this.filters = filters;
    }

    stopMeasurements(): void {
        this.runningLatency = false;
        this.runningBandwidth = false;

        this.abortControllers.forEach((o) => {
            o.abort();
        });
        this.abortControllers = [];

        this.lce.terminate();

        this.emit(CCTEvents.LATENCY_END);
        this.emit(CCTEvents.BANDWIDTH_END);
    }

    async startLatencyChecks(params: LatencyChecksParams = {}): Promise<void> {
        const {iterations = 16, save = true} = params;

        await this.startMeasurements('latency', {...params, iterations, save}, new AbortController());
    }

    async startBandwidthChecks(params: BandwidthChecksParams = {}): Promise<void> {
        const {iterations = 4, save = true} = params;

        await this.startMeasurements('bandwidth', {...params, iterations, save}, new AbortController());
    }

    private async startMeasurements(
        type: MeasurementType,
        params: MeasurementParams,
        abortController: AbortController
    ): Promise<void> {
        const config = this.measurementConfigs[type];
        const stateProperty = type === 'latency' ? 'runningLatency' : 'runningBandwidth';

        this[stateProperty] = true;
        this.abortControllers.push(abortController);

        const dc = params.from && this.allDatacenters.find((dc) => dc.id === params.from);
        if (dc) {
            await this.startCloudMeasurements(config, params, dc, abortController);
        } else if (this.datacenters.length !== 0) {
            await this.startLocalMeasurements(config, params, abortController);
        }

        if (!abortController.signal.aborted) {
            this[stateProperty] = false;
            this.emit(config.endEvent);
        }
    }

    public setIdToExlude(ids?: string[]) {
        this.idsToExclude = ids || [];
        this.setFilters(this.filters);
    }

    private clearSocket(type: MeasurementType): void {
        let socket = this.sockets[type];
        if (!socket) return;

        socket.emit(SocketEvents.DISCONNECT);
        socket.removeAllListeners();
        socket = null;

        this.sockets[type] = null;
    }

    private async startCloudMeasurements<T>(
        config: MeasurementConfig<T>,
        params: MeasurementParams,
        dc: Datacenter,
        abortController: AbortController
    ): Promise<void> {
        if (Util.isBackEnd()) return;

        return new Promise<void>((resolve) => {
            const resolveAndClear = () => {
                this.clearSocket(config.type);
                resolve();
            };

            abortController.signal.addEventListener('abort', resolveAndClear);
            const socket = io('ws://localhost', {...defaultSocketConfig, query: {id: dc.id}});
            this.sockets[config.type] = socket;

            const events = [config.socketEndEvent, SocketEvents.DISCONNECT, SocketEvents.CONNECT_ERROR];
            events.forEach((event) => socket.on(event, resolveAndClear));

            socket.on(SocketEvents.CONNECT, () => {
                socket.emit(config.socketStartEvent, {
                    ...params,
                    id: dc.id,
                    filters: this.filters,
                });
            });

            socket.on(config.socketIterationEvent, (data: T) => {
                this.emit(config.iterationEvent, data);
            });

            socket.on(config.socketTickEvent, (data: T) => {
                this.handleEventData(data as LatencyEventData | BandwidthEventData, params.save!, config.type);

                this.emit(config.tickEvent, data);
            });
        });
    }

    private async startLocalMeasurements<T>(
        config: MeasurementConfig<T>,
        params: MeasurementParams,
        abortController: AbortController
    ): Promise<void> {
        let iterations = params.iterations!;
        while (iterations-- > 0) {
            if (abortController.signal.aborted) return;

            const eventData = (
                await Promise.all(
                    this.datacenters.map((dc) => this.startMeasurementFor(config, dc, params, abortController))
                )
            ).filter((entry) => entry !== null);

            if (!abortController.signal.aborted) {
                this.emit(config.iterationEvent, eventData);
            } else {
                return;
            }

            if (params.interval) {
                await Util.sleep(params.interval, abortController);
            }
        }
    }

    private async startMeasurementFor<T>(
        config: MeasurementConfig<T>,
        dc: Datacenter,
        params: MeasurementParams,
        abortController: AbortController
    ): Promise<{data: T; id: string} | null> {
        const result = await config.getMeasurementResult(dc, params);

        if (abortController.signal.aborted || result === null) return null;

        const data = {id: dc.id, data: result};

        this.handleEventData(data as LatencyEventData | BandwidthEventData, params.save!, config.type);

        this.emit(config.tickEvent, data);

        return data;
    }

    private handleEventData(
        {id, data}: LatencyEventData | BandwidthEventData,
        save: boolean,
        dataType: MeasurementType
    ): void {
        if (!save) return;

        const dcIndex = this.datacenters.findIndex((e) => e.id === id);

        if (dcIndex < 0) return;

        const dc = this.datacenters[dcIndex];

        if (dataType === 'latency') {
            dc.latencies = dc.latencies || [];
            dc.latencies.push(data as Latency);

            const averageLatency = Util.getAverageLatency(dc.latencies);
            dc.averageLatency = averageLatency;
            dc.latencyJudgement = Util.judgeLatency(averageLatency);
        } else if (dataType === 'bandwidth') {
            dc.bandwidths = dc.bandwidths || [];
            dc.bandwidths.push(data as Bandwidth);

            const averageBandwidth = Util.getAverageBandwidth(dc.bandwidths);
            dc.averageBandwidth = averageBandwidth;
            dc.bandwidthJudgement = Util.judgeBandwidth(averageBandwidth);
        }
    }

    getCurrentDatacentersSorted(): Datacenter[] {
        Util.sortDatacenters(this.datacenters);
        return this.datacenters;
    }

    async getAddress(): Promise<Location> {
        const location: Location = {
            address: '',
            latitude: 0,
            longitude: 0,
        };

        return new Promise((resolve) => {
            if (navigator && navigator?.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position: GeolocationPosition) => {
                        location.latitude = position.coords.latitude;
                        location.longitude = position.coords.longitude;

                        const geocoder = new google.maps.Geocoder();

                        await geocoder.geocode(
                            {
                                location: new google.maps.LatLng(location.latitude, location.longitude),
                            },
                            (results: GeocoderResult[], status: string) => {
                                if (status === 'OK') {
                                    location.address = results[0].formatted_address;
                                    resolve(location);
                                } else {
                                    // Clear up returned object
                                    location.address = '';
                                    location.latitude = 0;
                                    location.longitude = 0;
                                    resolve(location);
                                }
                            }
                        );
                    },
                    () => {
                        resolve(location);
                    }
                );
            } else {
                resolve(location);
            }
        });
    }

    async storeRequest(body: any): Promise<any> {
        return fetch('https://cct.demo-education.cloud.sap/measurement', {
            method: 'post',
            body: body,
            headers: {'Content-Type': 'application/json'},
        }).then((res: Response) => res.json());
    }

    async store(location?: Location): Promise<boolean> {
        if (!location) return false;

        const minimumThresholdToSave = 16;

        const data: StoreData[] = [];
        this.datacenters.forEach((dc, index) => {
            const newLatencyMeasurementsCount = dc.latencies.length - (dc.storedLatencyCount || 0);

            if (newLatencyMeasurementsCount >= minimumThresholdToSave) {
                const newAverageLatency = Util.getAverageLatency(dc.latencies, dc.storedLatencyCount);
                const newAverageBandwidth = Util.getAverageBandwidth(dc.bandwidths, dc.storedBandwidthCount);

                data.push({
                    id: dc.id,
                    latency: newAverageLatency.toFixed(2),
                    averageBandwidth: newAverageBandwidth.megaBitsPerSecond.toFixed(2),
                });

                this.datacenters[index].storedLatencyCount = dc.latencies.length;
                this.datacenters[index].storedBandwidthCount = dc.bandwidths.length;
            }
        });

        if (data.length === 0) {
            return false;
        }

        const payload = {
            uid: uuid(),
            ...location,
            data,
        };

        const body = JSON.stringify(payload, null, 4);

        try {
            const result = await this.storeRequest(body);
            return result.status === 'OK';
        } catch (error) {
            return false;
        }
    }

    clean(): void {
        this.datacenters.forEach((dc) => {
            dc.position = 0;
            dc.averageLatency = 0;
            dc.averageBandwidth = {
                bitsPerSecond: 0,
                kiloBitsPerSecond: 0,
                megaBitsPerSecond: 0,
            };
            dc.latencies = [];
            dc.bandwidths = [];
            dc.bandwidthJudgement = Speed.nothing;
            dc.latencyJudgement = Speed.nothing;
            dc.storedBandwidthCount = 0;
            dc.storedLatencyCount = 0;
        });
    }
}
