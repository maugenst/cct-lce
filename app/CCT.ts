import {v4 as uuid} from 'uuid';
import fetch, {Response} from 'node-fetch';
import {Datacenter} from '../@types/Datacenter';
import {
    BandwidthChecksParams,
    CCTEvents,
    FilterKeys,
    LatencyChecksParams,
    LocalStorage,
    Location,
    SocketEvents,
    Storage,
    StoreData,
} from '../@types/Shared';
import {LCE} from './LCE';
import {Util} from './Util';
import {Bandwidth, BandwidthEventData} from '../@types/Bandwidth';

import {EventEmitter} from 'events';

import {Latency, LatencyEventData} from '../@types/Latency';
import {io, Socket} from 'socket.io-client';
import AbortController from 'abort-controller';
import GeocoderResult = google.maps.GeocoderResult;

const localStorageName = 'CCT_DATA';

type MeasurementType = 'latency' | 'bandwidth';

type MeasurementParams = LatencyChecksParams | BandwidthChecksParams;

interface MeasurementConfig<T> {
    type: MeasurementType;
    socketStartEvent: SocketEvents;
    socketEndEvent: SocketEvents;
    socketIterationEvent: SocketEvents;
    socketTickEvent: SocketEvents;
    iterationEvent: CCTEvents;
    tickEvent: CCTEvents;

    endEvent: CCTEvents;
    getMeasurementResult: (dc: Datacenter, params: MeasurementParams) => Promise<T>;
}

const defaultSocketConfig = {
    reconnectionAttempts: 3,
    timeout: 10000,
};

export class CCT extends EventEmitter {
    allDatacenters: Datacenter[] = [];
    datacenters: Datacenter[] = [];

    runningLatency = false;
    runningBandwidth = false;

    private idToExclude: string | null = null;

    private compatibleDCsWithSockets: Datacenter[] = []; // drones with socket functionality

    private latencySocket: Socket | null = null;
    private bandwidthSocket: Socket | null = null;
    private filters?: FilterKeys;
    private storage: Storage[] = [];
    private lce = new LCE();
    private abortControllers: AbortController[] = [];

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
        this.storage = this.allDatacenters.map((dc) => {
            return {
                id: dc.id,
                latencies: [],
                bandwidths: [],
                shouldSave: false,
            };
        });

        this.clean();
        this.readLocalStorage();
    }

    async fetchCompatibleDCsWithSockets(): Promise<Datacenter[]> {
        const result = await Promise.all(
            this.datacenters.map(async (dc) => {
                const isCompatible = await this.lce.checkIfCompatibleWithSockets(dc.ip);
                return isCompatible ? dc : null;
            })
        );

        this.compatibleDCsWithSockets = result.filter((dc): dc is Datacenter => dc !== null);

        return this.compatibleDCsWithSockets;
    }

    setIdToExclude(id: string | null) {
        this.idToExclude = id;
        this.setFilters(this.filters);
    }

    setFilters(filters?: FilterKeys): void {
        this.datacenters = filters
            ? this.allDatacenters.filter((dc) => {
                  if (dc.id === this.idToExclude) {
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
            : this.allDatacenters.filter((dc) => dc.id !== this.idToExclude);

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

    private measurementConfigs: {[key in MeasurementType]?: MeasurementConfig<any>} = {
        latency: {
            type: 'latency',
            socketStartEvent: SocketEvents.LATENCY_START,
            socketEndEvent: SocketEvents.LATENCY_END,
            socketIterationEvent: SocketEvents.LATENCY_ITERATION,
            socketTickEvent: SocketEvents.LATENCY,
            iterationEvent: CCTEvents.LATENCY_ITERATION,
            tickEvent: CCTEvents.LATENCY,
            endEvent: CCTEvents.LATENCY_END,
            getMeasurementResult: this.lce.getLatencyFor.bind(this.lce),
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
            getMeasurementResult: (dc, params: BandwidthChecksParams) =>
                this.lce.getBandwidthFor(dc, params.bandwidthMode),
        },
    };

    async startLatencyChecks(params: LatencyChecksParams = {}): Promise<void> {
        params = {
            iterations: params.iterations || 16,
            saveToLocalStorage: typeof params.saveToLocalStorage === 'undefined' ? false : params.saveToLocalStorage,
            save: typeof params.save === 'undefined' ? true : params.save,
            ...params,
        };

        await this.startMeasurements('latency', params, new AbortController());
    }

    async startBandwidthChecks(params: BandwidthChecksParams = {}): Promise<void> {
        params = {
            iterations: params.iterations || 4,
            saveToLocalStorage: typeof params.saveToLocalStorage === 'undefined' ? false : params.saveToLocalStorage,
            save: typeof params.save === 'undefined' ? true : params.save,
            ...params,
        };

        await this.startMeasurements('bandwidth', params, new AbortController());
    }

    private async startMeasurements(
        type: MeasurementType,
        params: MeasurementParams,
        abortController: AbortController
    ): Promise<void> {
        const config = this.measurementConfigs[type]!;
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

    private clearSocket(type: MeasurementType): void {
        let socket = type === 'latency' ? this.latencySocket : this.bandwidthSocket;
        if (!socket) return;

        socket.emit(SocketEvents.DISCONNECT);
        socket.removeAllListeners();
        socket = null;

        if (type === 'latency') {
            this.latencySocket = null;
        } else if (type === 'bandwidth') {
            this.bandwidthSocket = null;
        }
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
            this[`${config.type}Socket`] = socket;

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
                if (config.type === 'latency') {
                    this.handleLatency(data as LatencyEventData, params.save!, params.saveToLocalStorage!);
                } else {
                    this.handleBandwidth(data as BandwidthEventData, params.save!, params.saveToLocalStorage!);
                }

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
    ): Promise<T | null> {
        const result = await config.getMeasurementResult(dc, params);
        console.log('result is here', config.type);
        if (abortController.signal.aborted || result === null) return null;
        console.log('result is being handled by data handler', config.type);

        const data = {id: dc.id, data: result};

        if (config.type === 'latency') {
            this.handleLatency(data as LatencyEventData, params.save!, params.saveToLocalStorage!);
        } else {
            this.handleBandwidth(data as BandwidthEventData, params.save!, params.saveToLocalStorage!);
        }

        this.emit(config.tickEvent, data);

        return result;
    }

    private handleLatency({id, data}: LatencyEventData, save: boolean, saveToLocalStorage: boolean): void {
        console.log('handle latency', data, save, saveToLocalStorage);

        if (!save) return;

        const dcIndex = this.datacenters.findIndex((e) => e.id === id);
        console.log(dcIndex, this.datacenters, data);
        if (dcIndex < 0) return;

        const dc = this.datacenters[dcIndex];
        dc.latencies = dc.latencies || [];
        dc.latencies.push(data);

        const averageLatency = Util.getAverageLatency(dc.latencies);
        dc.averageLatency = averageLatency;
        dc.latencyJudgement = Util.judgeLatency(averageLatency);

        this.addDataToStorage(dc.id, data);
        if (saveToLocalStorage) this.setLocalStorage();
    }

    private handleBandwidth({id, data}: BandwidthEventData, save: boolean, saveToLocalStorage: boolean): void {
        console.log('handle bandwidth', data, save, saveToLocalStorage);

        if (!save) return;

        const dcIndex = this.datacenters.findIndex((dc) => dc.id === id);
        if (dcIndex < 0) return;

        const dc = this.datacenters[dcIndex];
        dc.bandwidths = dc.bandwidths || [];
        dc.bandwidths.push(data);

        const averageBandwidth = Util.getAverageBandwidth(dc.bandwidths);
        dc.averageBandwidth = averageBandwidth;
        dc.bandwidthJudgement = Util.judgeBandwidth(averageBandwidth);

        this.addDataToStorage(dc.id, data);
        if (saveToLocalStorage) this.setLocalStorage();
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
        return await fetch('https://cct.demo-education.cloud.sap/measurement', {
            method: 'post',
            body: body,
            headers: {'Content-Type': 'application/json'},
        }).then((res: Response) => res.json());
    }

    async store(
        location: Location = {
            address: 'Dietmar-Hopp-Allee 16, 69190 Walldorf, Germany',
            latitude: 49.2933756,
            longitude: 8.6421212,
        }
    ): Promise<boolean> {
        const data: StoreData[] = [];

        this.storage = this.storage.map((item) => {
            if (item.shouldSave) {
                data.push({
                    id: item.id,
                    latency: `${Util.getAverageLatency(item.latencies)?.toFixed(2)}`,
                    averageBandwidth: Util.getAverageBandwidth(item.bandwidths).megaBitsPerSecond.toFixed(2),
                });

                return {
                    id: item.id,
                    latencies: [],
                    bandwidths: [],
                    shouldSave: false,
                };
            }
            return item;
        });

        const body = JSON.stringify(
            {
                uid: uuid(),
                address: location.address,
                latitude: location.latitude,
                longitude: location.longitude,
                data,
            },
            null,
            4
        );

        try {
            const result = await this.storeRequest(body);
            return result.status === 'OK';
        } catch (error) {
            return false;
        }
    }

    private addDataToStorage(id: string, data: Latency | Bandwidth) {
        this.storage = this.storage.map((item: Storage) => {
            if (item.id === id) {
                const isLatencyData = 'value' in data && typeof data.value === 'number';

                const latencies = isLatencyData ? [...item.latencies, data as Latency] : item.latencies;

                const bandwidths = isLatencyData ? item.bandwidths : [...item.bandwidths, data as Bandwidth];

                return {
                    id: item.id,
                    latencies,
                    bandwidths,
                    shouldSave: latencies.length >= 16,
                };
            }

            return item;
        });
    }

    private setLocalStorage() {
        if (Util.isBackEnd()) {
            return;
        }

        window.localStorage.removeItem(localStorageName);

        const data: LocalStorage[] = this.allDatacenters.map((dc) => {
            return {
                id: dc.id,
                latencies: dc.latencies,
                averageLatency: dc.averageLatency,
                latencyJudgement: dc.latencyJudgement,
                bandwidths: dc.bandwidths,
                averageBandwidth: dc.averageBandwidth,
                bandwidthJudgement: dc.bandwidthJudgement,
            };
        });

        window.localStorage.setItem(localStorageName, JSON.stringify(data));
    }

    private readLocalStorage(): void {
        if (Util.isBackEnd()) {
            return;
        }

        const data: string | null = window.localStorage.getItem(localStorageName);

        if (!data) {
            return;
        }
        const parsedData: LocalStorage[] = JSON.parse(data);
        this.allDatacenters = this.allDatacenters.map((dc) => {
            const foundItem = parsedData.find((item) => item.id === dc.id);
            if (foundItem) {
                return {
                    ...dc,
                    averageLatency: foundItem.averageLatency,
                    latencyJudgement: foundItem.latencyJudgement,
                    averageBandwidth: foundItem.averageBandwidth,
                    bandwidthJudgement: foundItem.bandwidthJudgement,
                    latencies: foundItem.latencies,
                    bandwidths: foundItem.bandwidths,
                };
            }
            return dc;
        });

        window.localStorage.removeItem(localStorageName);
    }

    subscribe(event: CCTEvents, callback: () => void): void {
        this.on(event, callback);
    }

    unsubscribe(event: CCTEvents, callback: () => void): void {
        this.off(event, callback);
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
        });
    }
}
