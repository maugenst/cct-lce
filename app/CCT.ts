import {v4 as uuid} from 'uuid';
import fetch, {Response} from 'node-fetch';
import {Datacenter, Speed} from '../@types/Datacenter';
import {
    BandwidthDataPoint,
    Events,
    FilterKeys,
    LatencyChecksParams,
    LocalStorage,
    Location,
    Storage,
    StoreData,
} from '../@types/Shared';
import {LCE} from './LCE';
import {Util} from './Util';
import {BandwidthMode, BandwithPerSecond} from '../@types/Bandwidth';
import GeocoderResult = google.maps.GeocoderResult;

import {EventEmitter} from 'events';

import {Latency, LatencyEventData, LatencyIterationEvent} from '../@types/Latency';
import {io} from 'socket.io-client';

const localStorageName = 'CCT_DATA';

export class CCT extends EventEmitter {
    allDatacenters: Datacenter[];
    datacenters: Datacenter[];
    runningLatency = false;
    runningBandwidth = false;
    socket: any;
    private filters?: FilterKeys;
    private storage: Storage[] = [];
    private lce: LCE;

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

        this.lce = new LCE(this.datacenters);
    }

    setFilters(filters?: FilterKeys): void {
        if (!filters) {
            this.lce.updateDatacenters(this.allDatacenters);
            return;
        }

        this.datacenters = this.allDatacenters.filter((dc) =>
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
        );

        this.lce.updateDatacenters(this.datacenters);

        this.filters = filters;
    }

    stopMeasurements(): void {
        this.runningLatency = false;
        this.runningBandwidth = false;

        if (this.socket) {
            this.socket.emit('disconnectSocket');
            this.socket = null;
            return;
        }

        this.lce.terminate();
    }

    async startLatencyChecks(params: LatencyChecksParams): Promise<void> {
        this.runningLatency = true;

        if (params.from) {
            const index = this.datacenters.findIndex((e) => e.id === params.from);
            await this.startCloudLatencyMeasurements(this.datacenters[index], params);
        } else {
            await this.startLocalLatencyMeasurements(params);
        }

        this.runningLatency = false;
    }

    private async startCloudLatencyMeasurements(dc: Datacenter, parameters: LatencyChecksParams): Promise<void> {
        console.log(dc);
        if (Util.isBackEnd()) {
            return;
        }

        if (this.socket) {
            this.socket.emit('disconnectSocket');
            this.socket = null;
        }

        this.socket = io('ws://localhost');

        this.socket.on('connect', () => this.socket.emit('startLatency', parameters, this.filters));

        this.socket.on('disconnectSocket', () => this.stopMeasurements());

        this.socket.on('latencyCalcSocket', (latencyEventData: LatencyEventData) => {
            this.handleLatency(latencyEventData, true, false);

            this.emit(Events.LATENCY_CALC, latencyEventData);
        });

        this.socket.on('latencyCalcIterationSocket', (latencyEventData: LatencyEventData[]) => {
            this.emit(Events.LATENCY_CALC_ITERATION, latencyEventData);
        });
    }

    private async startLocalLatencyMeasurements({
        iterations = 16,
        saveToLocalStorage = false,
        save = true,
    }: Omit<LatencyChecksParams, 'from'>): Promise<void> {
        while (this.runningLatency && iterations > 0) {
            const latencyIterationEventData = await Promise.all(
                this.datacenters.map((dc) => this.startMeasurementForLatency(dc, saveToLocalStorage, save))
            );

            this.emit(Events.LATENCY_CALC_ITERATION, latencyIterationEventData);

            iterations--;
        }
    }

    private async startMeasurementForLatency(
        dc: Datacenter,
        save: boolean,
        saveToLocalStorage: boolean
    ): Promise<LatencyEventData> {
        const latency: Latency = await this.lce.getLatencyFor(dc);

        const latencyEventData = {id: dc.id, latency};

        this.handleLatency(latencyEventData, save, saveToLocalStorage);

        this.emit(Events.LATENCY_CALC, latencyEventData);

        return latencyEventData;
    }

    private handleLatency(data: LatencyEventData, save: boolean, saveToLocalStorage: boolean) {
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

    async startBandwidthChecks({
        iterations,
        bandwidthMode,
        saveToLocalStorage = false,
        save = true,
    }: {
        iterations: number;
        bandwidthMode?: BandwidthMode | undefined;
        saveToLocalStorage?: boolean;
        save?: boolean;
    }): Promise<void> {
        this.runningBandwidth = true;

        const bandwidthMeasurementPromises: Promise<void>[] = [];
        for (let dcLength = 0; dcLength < this.datacenters.length; dcLength++) {
            const dc = this.datacenters[dcLength];
            bandwidthMeasurementPromises.push(
                this.startMeasurementForBandwidth({iterations, dc, bandwidthMode, saveToLocalStorage, save})
            );
        }

        await Promise.all(bandwidthMeasurementPromises);

        this.runningBandwidth = false;
    }

    private async startMeasurementForBandwidth({
        iterations,
        dc,
        bandwidthMode = BandwidthMode.big,
        saveToLocalStorage = false,
        save = false,
    }: {
        iterations: number;
        dc: Datacenter;
        bandwidthMode?: BandwidthMode;
        saveToLocalStorage?: boolean;
        save?: boolean;
    }): Promise<void> {
        for (let i = 0; i < iterations; i++) {
            const result = await this.lce.getBandwidthForId(dc.id, {bandwidthMode});

            if (!this.runningBandwidth) {
                return;
            }

            if (result && result.bandwidth && save) {
                const index = this.datacenters.findIndex((e) => e.id === dc.id);
                const dataPoint: BandwidthDataPoint = {value: result.bandwidth, timestamp: result.timestamp};

                this.datacenters[index].bandwidths?.push(dataPoint);
                const averageBandwidth = Util.getAverageBandwidth(this.datacenters[index].bandwidths);
                this.datacenters[index].averageBandwidth = averageBandwidth;
                this.datacenters[index].bandwidthJudgement = this.judgeBandwidth(averageBandwidth);
                this.addDataToStorage(dc.id, dataPoint);

                if (saveToLocalStorage) {
                    this.setLocalStorage();
                }
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

    judgeBandwidth(averageBandwidth: BandwithPerSecond): Speed {
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

    private addDataToStorage(id: string, data: Latency | BandwidthDataPoint) {
        this.storage = this.storage.map((item: Storage) => {
            if (item.id === id) {
                const isLatencyData = 'value' in data && typeof data.value === 'number';

                const latencies = isLatencyData ? [...item.latencies, data as Latency] : item.latencies;

                const bandwidths = isLatencyData ? item.bandwidths : [...item.bandwidths, data as BandwidthDataPoint];

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

    subscribe(event: Events, callback: () => void): void {
        this.on(event, callback);
    }

    unsubscribe(event: Events, callback: () => void): void {
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
