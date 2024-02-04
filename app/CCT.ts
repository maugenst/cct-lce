import {v4 as uuid} from 'uuid';
import fetch, {Response} from 'node-fetch';
import {Datacenter, Speed} from '../@types/Datacenter';
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
import {Bandwidth, BandwidthEventData, BandwidthPerSecond} from '../@types/Bandwidth';

import {EventEmitter} from 'events';

import {Latency, LatencyEventData} from '../@types/Latency';
import {io} from 'socket.io-client';
import GeocoderResult = google.maps.GeocoderResult;
import AbortController from 'abort-controller';

const localStorageName = 'CCT_DATA';

export class CCT extends EventEmitter {
    allDatacenters: Datacenter[];
    datacenters: Datacenter[];
    runningLatency = false;
    runningBandwidth = false;
    private latencySocket: any;

    private bandwidthSocket: any;

    private filters?: FilterKeys;
    private storage: Storage[] = [];
    private lce = new LCE();
    private abortController: AbortController[] = [];

    constructor() {
        super();
    }

    async fetchDatacenterInformationRequest(dictionaryUrl: string): Promise<Datacenter[]> {
        try {
            return (await fetch(dictionaryUrl).then((res: Response) => res.json())) as Datacenter[];
        } catch {
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

    setFilters(filters?: FilterKeys): void {
        this.datacenters = filters
            ? this.allDatacenters.filter((dc) =>
                  Object.keys(filters).every((key) => {
                      if (key === 'tags') {
                          return filters[key as keyof FilterKeys]!.some((tag) => {
                              return dc[key].toLowerCase().includes(tag.toLowerCase());
                          });
                      }

                      return filters[key as keyof FilterKeys]!.map((filterVal) => filterVal.toLowerCase()).includes(
                          dc[key as keyof FilterKeys]!.toLowerCase()
                      );
                  })
              )
            : this.allDatacenters;

        this.filters = filters;
    }

    private async startCloudLatencyMeasurements(
        dc: Datacenter,
        {iterations, interval, save, saveToLocalStorage}: Omit<LatencyChecksParams, 'from'>
    ): Promise<void> {
        console.log(dc);
        if (Util.isBackEnd()) {
            return;
        }

        if (this.latencySocket) {
            this.latencySocket.emit(SocketEvents.DISCONNECT);
            this.latencySocket = null;
        }

        this.latencySocket = io('ws://localhost');

        this.latencySocket.on('connect', () =>
            this.latencySocket.emit(SocketEvents.LATENCY_START, this.filters, iterations, interval)
        );

        this.latencySocket.on(SocketEvents.DISCONNECT, () => this.stopMeasurements());

        this.latencySocket.on(SocketEvents.LATENCY, (latencyEventData: LatencyEventData) => {
            this.handleLatency(latencyEventData, save, saveToLocalStorage);

            this.emit(CCTEvents.LATENCY, latencyEventData);
        });

        this.latencySocket.on(SocketEvents.LATENCY_ITERATION, (latencyEventData: LatencyEventData[]) => {
            this.emit(CCTEvents.LATENCY_ITERATION, latencyEventData);
        });
    }

    stopMeasurements(): void {
        this.runningLatency = false;
        this.runningBandwidth = false;

        if (this.latencySocket) {
            this.latencySocket.emit(SocketEvents.DISCONNECT);
            this.latencySocket = null;
            return;
        }

        this.abortController.forEach((o) => {
            o.abort();
        });
        this.abortController = [];

        this.lce.terminate();
    }

    async startLatencyChecks(parameters: LatencyChecksParams): Promise<void> {
        this.runningLatency = true;

        if (parameters.from) {
            const index = this.datacenters.findIndex((e) => e.id === parameters.from);
            await this.startCloudLatencyMeasurements(this.datacenters[index], parameters);
        } else {
            const abortController = new AbortController();
            this.abortController.push(abortController);

            await this.startLocalLatencyMeasurements(parameters, abortController);
        }

        this.runningLatency = false;
    }

    private async startLocalLatencyMeasurements(
        {iterations = 16, interval, save, saveToLocalStorage}: Omit<LatencyChecksParams, 'from'>,
        abortController: AbortController
    ): Promise<void> {
        while (iterations > 0) {
            if (abortController.signal.aborted) {
                return;
            }

            const latencyIterationEventData = await Promise.all(
                this.datacenters.map((dc) =>
                    this.startMeasurementForLatency(dc, abortController, save, saveToLocalStorage)
                )
            );

            if (abortController.signal.aborted) {
                const filteredEventData = latencyIterationEventData.filter((entry) => entry !== null);
                if (filteredEventData.length) {
                    this.emit(CCTEvents.LATENCY_ITERATION, filteredEventData);
                }
                return;
            } else {
                this.emit(CCTEvents.LATENCY_ITERATION, latencyIterationEventData);
            }

            iterations--;

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
        const latency: Latency = await this.lce.getLatencyFor(dc);

        if (abortController.signal.aborted) {
            return null;
        }

        const latencyEventData = {id: dc.id, latency};

        this.handleLatency(latencyEventData, save, saveToLocalStorage);

        this.emit(CCTEvents.LATENCY, latencyEventData);

        return latencyEventData;
    }

    private handleLatency(data: LatencyEventData, save = true, saveToLocalStorage = false): void {
        if (save) {
            const index = this.datacenters.findIndex((e) => e.id === data.id);

            this.datacenters[index].latencies?.push(data.latency);
            const averageLatency = Util.getAverageLatency(this.datacenters[index].latencies);
            this.datacenters[index].averageLatency = averageLatency;
            this.datacenters[index].latencyJudgement = this.judgeLatency(averageLatency);

            this.addDataToStorage(this.datacenters[index].id, data.latency);

            if (saveToLocalStorage) {
                this.setLocalStorage();
            }
        }
    }

    async startBandwidthChecks(parameters: BandwidthChecksParams): Promise<void> {
        this.runningBandwidth = true;

        if (parameters.from) {
            const index = this.datacenters.findIndex((e) => e.id === parameters.from);
            await this.startCloudBandwidthMeasurements(this.datacenters[index], parameters);
        } else {
            const abortController = new AbortController();
            this.abortController.push(abortController);

            await this.startLocalBandwidthMeasurements(parameters, abortController);
        }

        this.runningBandwidth = false;
    }

    private async startCloudBandwidthMeasurements(
        dc: Datacenter,
        {iterations, interval, save, saveToLocalStorage, bandwidthMode}: Omit<BandwidthChecksParams, 'from'>
    ): Promise<void> {
        console.log(dc);
        if (Util.isBackEnd()) {
            return;
        }

        if (this.bandwidthSocket) {
            this.bandwidthSocket.emit(SocketEvents.DISCONNECT);
            this.bandwidthSocket = null;
        }

        this.bandwidthSocket = io('ws://localhost');

        this.bandwidthSocket.on('connect', () =>
            this.bandwidthSocket.emit(SocketEvents.BANDWIDTH_START, this.filters, iterations, interval, bandwidthMode)
        );

        this.bandwidthSocket.on(SocketEvents.DISCONNECT, () => this.stopMeasurements());

        this.bandwidthSocket.on(SocketEvents.BANDWIDTH, (bandwidthEventData: BandwidthEventData) => {
            this.handleBandwidth(bandwidthEventData, save, saveToLocalStorage);

            this.emit(CCTEvents.BANDWIDTH, bandwidthEventData);
        });

        this.bandwidthSocket.on(SocketEvents.BANDWIDTH_ITERATION, (latencyEventData: LatencyEventData[]) => {
            this.emit(CCTEvents.BANDWIDTH_ITERATION, latencyEventData);
        });
    }

    private async startLocalBandwidthMeasurements(
        {iterations = 4, interval, save, saveToLocalStorage, bandwidthMode}: Omit<BandwidthChecksParams, 'from'>,
        abortController: AbortController
    ): Promise<void> {
        while (iterations > 0) {
            if (abortController.signal.aborted) {
                return;
            }

            const bandwidthIterationEventData = await Promise.all(
                this.datacenters.map((dc) =>
                    this.startMeasurementForBandwidth(dc, abortController, save, saveToLocalStorage, bandwidthMode)
                )
            );

            if (abortController.signal.aborted) {
                const filteredEventData = bandwidthIterationEventData.filter((entry) => entry !== null);
                if (filteredEventData.length) {
                    this.emit(CCTEvents.BANDWIDTH_ITERATION, filteredEventData);
                }
                return;
            } else {
                this.emit(CCTEvents.BANDWIDTH_ITERATION, bandwidthIterationEventData);
            }

            iterations--;

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
        const bandwidth: Bandwidth | null = await this.lce.getBandwidthFor(dc, bandwidthMode);

        if (!bandwidth || abortController.signal.aborted) {
            return null;
        }

        const bandwidthEventData = {id: dc.id, bandwidth};

        this.handleBandwidth(bandwidthEventData, save, saveToLocalStorage);

        this.emit(CCTEvents.BANDWIDTH, bandwidthEventData);

        return bandwidthEventData;
    }

    private handleBandwidth(data: BandwidthEventData, save = true, saveToLocalStorage = false): void {
        if (save) {
            const index = this.datacenters.findIndex((e) => e.id === data.id);

            this.datacenters[index].bandwidths?.push(data.bandwidth);
            const averageBandwidth = Util.getAverageBandwidth(this.datacenters[index].bandwidths);
            this.datacenters[index].averageBandwidth = averageBandwidth;
            this.datacenters[index].bandwidthJudgement = this.judgeBandwidth(averageBandwidth);

            this.addDataToStorage(data.id, data.bandwidth);

            if (saveToLocalStorage) {
                this.setLocalStorage();
            }
        }
    }

    judgeLatency(averageLatency: number): Speed {
        if (averageLatency < 170) {
            return Speed.good; // green
        } else if (averageLatency >= 170 && averageLatency < 280) {
            return Speed.ok; // yellow
        } else {
            return Speed.bad; // red
        }
    }

    judgeBandwidth(averageBandwidth: BandwidthPerSecond): Speed {
        if (averageBandwidth.megaBitsPerSecond > 1) {
            return Speed.good; // green
        } else if (averageBandwidth.megaBitsPerSecond <= 1 && averageBandwidth.megaBitsPerSecond > 0.3) {
            return Speed.ok; // yellow
        } else {
            return Speed.bad; // red
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
