import {v4 as uuid} from 'uuid';
import fetch, {Response} from 'node-fetch';
import {Datacenter} from '../@types/Datacenter';
import {
    BandwidthChecksParams,
    BandwidthMode,
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

// TODO: 1. fix re-connect, refactor (combine latency and bandwidth), tests.
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

    private async clearLatencySocket(): Promise<void> {
        if (!this.latencySocket) return;

        this.latencySocket.emit(SocketEvents.DISCONNECT);
        this.latencySocket.removeAllListeners();
        this.latencySocket = null;
        console.log('abortedCloudLatencyMeasurements');
    }

    private async startCloudLatencyMeasurements(
        {iterations, interval, save, saveToLocalStorage}: Omit<LatencyChecksParams, 'from'>,
        dc: Datacenter,
        abortController: AbortController
    ): Promise<void> {
        if (Util.isBackEnd()) return;

        return new Promise<void>((resolve) => {
            const resolveAndClear = () => {
                this.clearLatencySocket();
                resolve();
            };

            abortController.signal.addEventListener('abort', resolveAndClear);

            this.latencySocket = io('ws://localhost', {...defaultSocketConfig, query: {id: dc.id}});

            const events = [SocketEvents.LATENCY_END, SocketEvents.DISCONNECT, SocketEvents.CONNECT_ERROR];
            events.forEach((event) => this.latencySocket!.on(event, resolveAndClear));

            this.latencySocket.on(SocketEvents.CONNECT, () => {
                this.latencySocket?.emit(SocketEvents.LATENCY_START, {
                    id: dc.id,
                    filters: this.filters,
                    iterations,
                    interval,
                });
            });

            this.latencySocket.on(SocketEvents.LATENCY, (data: LatencyEventData) => {
                this.handleLatency(data, save, saveToLocalStorage);
                this.emit(CCTEvents.LATENCY, data);
            });

            this.latencySocket.on(SocketEvents.LATENCY_ITERATION, (data: LatencyEventData[]) => {
                this.emit(CCTEvents.LATENCY_ITERATION, data);
            });
        });
    }

    async startLatencyChecks(parameters: LatencyChecksParams = {}): Promise<void> {
        console.log('startedCloudLatencyMeasurements');
        this.runningLatency = true;

        const abortController = new AbortController();
        this.abortControllers.push(abortController);

        const dc = parameters.from && this.allDatacenters.find((dc) => dc.id === parameters.from);
        if (dc) {
            await this.startCloudLatencyMeasurements(parameters, dc, abortController);
        } else {
            if (this.datacenters.length !== 0) {
                await this.startLocalLatencyMeasurements(parameters, abortController);
            }
        }

        if (abortController.signal.aborted) {
            return;
        }

        this.runningLatency = false;
        console.log('before emit endedCloudLatencyMeasurements natural end');
        this.emit(CCTEvents.LATENCY_END);
        console.log('after emit endedCloudLatencyMeasurements');
    }

    private async startLocalLatencyMeasurements(
        {iterations = 16, interval, save, saveToLocalStorage}: Omit<LatencyChecksParams, 'from'>,
        abortController: AbortController
    ): Promise<void> {
        while (iterations-- > 0) {
            if (abortController.signal.aborted) return;

            const latencyIterationEventData = (
                await Promise.all(
                    this.datacenters.map((dc) =>
                        this.startMeasurementForLatency(dc, abortController, save, saveToLocalStorage)
                    )
                )
            ).filter((entry) => entry !== null);

            if (!abortController.signal.aborted) {
                this.emit(CCTEvents.LATENCY_ITERATION, latencyIterationEventData);
            } else {
                return;
            }

            if (interval) {
                await Util.sleep(interval, abortController);
            }
        }
    }

    private async startMeasurementForLatency(
        dc: Datacenter,
        abortController: AbortController,
        save?: boolean,
        saveToLocalStorage?: boolean
    ): Promise<LatencyEventData | null> {
        const latency = await this.lce.getLatencyFor(dc);

        if (abortController.signal.aborted) return null;

        const data = {id: dc.id, latency};

        this.handleLatency(data, save, saveToLocalStorage);
        this.emit(CCTEvents.LATENCY, data);

        return data;
    }

    private handleLatency(data: LatencyEventData, save = true, saveToLocalStorage = false): void {
        if (!save) return;

        const dcIndex = this.datacenters.findIndex((e) => e.id === data.id);

        if (dcIndex < 0) return;

        const dc = this.datacenters[dcIndex];
        dc.latencies = dc.latencies || [];
        dc.latencies.push(data.latency);

        const averageLatency = Util.getAverageLatency(dc.latencies);
        dc.averageLatency = averageLatency;
        dc.latencyJudgement = Util.judgeLatency(averageLatency);

        this.addDataToStorage(dc.id, data.latency);
        if (saveToLocalStorage) this.setLocalStorage();
    }

    // BANDWIDTH CHECKS

    private async clearBandwidthSocket(): Promise<void> {
        if (!this.bandwidthSocket) return;

        this.bandwidthSocket.emit(SocketEvents.DISCONNECT);
        this.bandwidthSocket.removeAllListeners();
        this.bandwidthSocket = null;
        console.log('abortedCloudBandwidthMeasurements');
    }

    async startBandwidthChecks(parameters: BandwidthChecksParams = {}): Promise<void> {
        console.log('startedCloudBandwidthMeasurements');
        this.runningBandwidth = true;

        const abortController = new AbortController();
        this.abortControllers.push(abortController);

        const dc = parameters.from && this.allDatacenters.find((dc) => dc.id === parameters.from);
        if (dc) {
            await this.startCloudBandwidthMeasurements(parameters, dc, abortController);
        } else {
            if (this.datacenters.length !== 0) {
                await this.startLocalBandwidthMeasurements(parameters, abortController);
            }
        }

        if (abortController.signal.aborted) {
            return;
        }

        this.runningBandwidth = false;
        console.log('before emit endedCloudBandwidthMeasurements');
        this.emit(CCTEvents.BANDWIDTH_END);
        console.log('after emit endedCloudBandwidthMeasurements');
    }

    private async startCloudBandwidthMeasurements(
        {iterations, interval, save, saveToLocalStorage, bandwidthMode}: Omit<BandwidthChecksParams, 'from'>,
        dc: Datacenter,
        abortController: AbortController
    ): Promise<void> {
        if (Util.isBackEnd()) return;

        return new Promise<void>((resolve) => {
            const resolveAndClear = () => {
                this.clearBandwidthSocket();
                resolve();
            };

            abortController.signal.addEventListener('abort', resolveAndClear);

            this.bandwidthSocket = io('ws://localhost', {...defaultSocketConfig, query: {id: dc.id}});

            const events = [SocketEvents.BANDWIDTH_END, SocketEvents.DISCONNECT, SocketEvents.CONNECT_ERROR];
            events.forEach((event) => this.bandwidthSocket!.on(event, resolveAndClear));

            this.bandwidthSocket.on(SocketEvents.CONNECT, () => {
                this.bandwidthSocket?.emit(SocketEvents.BANDWIDTH_START, {
                    id: dc.id,
                    filters: this.filters,
                    iterations,
                    interval,
                    bandwidthMode,
                });
            });

            this.bandwidthSocket.on(SocketEvents.BANDWIDTH, (data: BandwidthEventData) => {
                this.handleBandwidth(data, save, saveToLocalStorage);
                this.emit(CCTEvents.BANDWIDTH, data);
            });

            this.bandwidthSocket.on(SocketEvents.BANDWIDTH_ITERATION, (data: BandwidthEventData[]) => {
                this.emit(CCTEvents.BANDWIDTH_ITERATION, data);
            });
        });
    }

    private async startLocalBandwidthMeasurements(
        {iterations = 4, interval, save, saveToLocalStorage, bandwidthMode}: Omit<BandwidthChecksParams, 'from'>,
        abortController: AbortController
    ): Promise<void> {
        while (iterations-- > 0) {
            if (abortController.signal.aborted) return;

            const bandwidthIterationEventData = (
                await Promise.all(
                    this.datacenters.map((dc) =>
                        this.startMeasurementForBandwidth(dc, abortController, save, saveToLocalStorage, bandwidthMode)
                    )
                )
            ).filter((entry) => entry !== null);

            if (!abortController.signal.aborted) {
                this.emit(CCTEvents.BANDWIDTH_ITERATION, bandwidthIterationEventData);
            } else {
                return;
            }

            if (interval) {
                await Util.sleep(interval, abortController);
            }
        }
    }

    private async startMeasurementForBandwidth(
        dc: Datacenter,
        abortController: AbortController,
        save?: boolean,
        saveToLocalStorage?: boolean,
        bandwidthMode?: BandwidthMode
    ): Promise<BandwidthEventData | null> {
        const bandwidth = await this.lce.getBandwidthFor(dc, bandwidthMode);

        if (abortController.signal.aborted || bandwidth === null) return null;

        const data = {id: dc.id, bandwidth};

        this.handleBandwidth(data, save, saveToLocalStorage);
        this.emit(CCTEvents.BANDWIDTH, data);

        return data;
    }

    private handleBandwidth(data: BandwidthEventData, save = true, saveToLocalStorage = false): void {
        if (!save) return;

        const dcIndex = this.datacenters.findIndex((dc) => dc.id === data.id);
        if (dcIndex < 0) return;

        const dc = this.datacenters[dcIndex];
        dc.bandwidths = dc.bandwidths || [];
        dc.bandwidths.push(data.bandwidth);

        const averageBandwidth = Util.getAverageBandwidth(dc.bandwidths);
        dc.averageBandwidth = averageBandwidth;
        dc.bandwidthJudgement = Util.judgeBandwidth(averageBandwidth);

        this.addDataToStorage(dc.id, data.bandwidth);
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
