import {v4 as uuid} from 'uuid';
import fetch, {Response} from 'node-fetch';
import {Datacenter, Speed} from '../@types/Datacenter';
import {Events, FilterKeys, LocalStorage, Location, Storage, StoreData} from '../@types/Shared';
import {LCE} from './LCE';
import {Util} from './Util';
import {BandwidthMode, BandwithPerSecond} from '../@types/Bandwidth';
import GeocoderResult = google.maps.GeocoderResult;

const localStorageName = 'CCT_DATA';

export class CCT {
    allDatacenters: Datacenter[];
    datacenters: Datacenter[];
    lce: LCE;
    storage: Storage[] = [];
    runningLatency = false;
    runningBandwidth = false;

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

    setFilters(filters?: FilterKeys) {
        this.datacenters = filters
            ? this.allDatacenters.filter((dc) =>
                  Object.keys(filters).every((key) => {
                      // @ts-ignore
                      return filters[key].includes(dc[key]);
                  })
              )
            : this.allDatacenters;

        this.lce.updateDatacenters(this.datacenters);
    }

    stopMeasurements(): void {
        this.runningLatency = false;
        this.runningBandwidth = false;
        this.lce.terminate();
    }

    async startLatencyChecks({
        iterations,
        saveToLocalStorage = false,
        save = true,
    }: {
        iterations: number;
        saveToLocalStorage?: boolean;
        save?: boolean;
    }): Promise<void> {
        this.runningLatency = true;

        const latencyMeasurementPromises: Promise<void>[] = [];
        for (let dcLength = 0; dcLength < this.datacenters.length; dcLength++) {
            const dc = this.datacenters[dcLength];
            latencyMeasurementPromises.push(
                this.startMeasurementForLatency({iterations, dc, saveToLocalStorage, save})
            );
        }

        await Promise.all(latencyMeasurementPromises);
        this.runningLatency = false;
    }

    private async startMeasurementForLatency({
        iterations,
        dc,
        saveToLocalStorage = false,
        save = false,
    }: {
        iterations: number;
        dc: Datacenter;
        saveToLocalStorage?: boolean;
        save?: boolean;
    }): Promise<void> {
        for (let i = 0; i < iterations; i++) {
            const result = await this.lce.getLatencyForId(dc.id);

            if (!this.runningLatency) {
                return;
            }

            if (result && result.latency && save) {
                const index = this.datacenters.findIndex((e) => e.id === dc.id);

                this.datacenters[index].latencies?.push(result.latency);
                const averageLatency = Util.getAverageLatency(this.datacenters[index].latencies);
                this.datacenters[index].averageLatency = averageLatency;
                this.datacenters[index].latencyJudgement = this.judgeLatency(averageLatency);
                this.addDataToStorage(dc.id, result.latency);

                if (saveToLocalStorage) {
                    this.setLocalStorage();
                }
            }
        }
    }

    async startBandwidthChecks({
        datacenter,
        iterations,
        bandwidthMode,
        saveToLocalStorage = false,
        save = true,
    }: {
        datacenter: Datacenter | Datacenter[];
        iterations: number;
        bandwidthMode?: BandwidthMode | undefined;
        saveToLocalStorage?: boolean;
        save?: boolean;
    }): Promise<void> {
        this.runningBandwidth = true;
        if (Array.isArray(datacenter)) {
            const bandwidthMeasurementPromises: Promise<void>[] = [];
            datacenter.forEach((dc) => {
                bandwidthMeasurementPromises.push(
                    this.startMeasurementForBandwidth(dc, iterations, bandwidthMode, saveToLocalStorage, save)
                );
            });

            await Promise.all(bandwidthMeasurementPromises);
        } else {
            await this.startMeasurementForBandwidth(datacenter, iterations, bandwidthMode, saveToLocalStorage, save);
        }

        this.runningBandwidth = false;
    }

    private async startMeasurementForBandwidth(
        dc: Datacenter,
        iterations: number,
        bandwidthMode: BandwidthMode = BandwidthMode.big,
        saveToLocalStorage: boolean,
        save: boolean
    ): Promise<void> {
        for (let i = 0; i < iterations; i++) {
            const result = await this.lce.getBandwidthForId(dc.id, {bandwidthMode});

            if (!this.runningBandwidth) {
                return;
            }

            if (result && result.bandwidth && save) {
                const index = this.datacenters.findIndex((e) => e.id === dc.id);

                this.datacenters[index].bandwidths?.push(result.bandwidth);
                const averageBandwidth = Util.getAverageBandwidth(this.datacenters[index].bandwidths);
                this.datacenters[index].averageBandwidth = averageBandwidth;
                this.datacenters[index].bandwidthJudgement = this.judgeBandwidth(averageBandwidth);
                this.addDataToStorage(dc.id, result.bandwidth);

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

    private addDataToStorage(id: string, data: number | BandwithPerSecond) {
        this.storage = this.storage.map((item: Storage) => {
            if (item.id === id) {
                const isDataNumber = typeof data === 'number';
                const latencies = isDataNumber ? [...item.latencies, data] : item.latencies;
                const bandwidths = isDataNumber ? item.bandwidths : [...item.bandwidths, data];

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
        if (this.lce) {
            this.lce.on(event, callback);
        }
    }

    unsubscribe(event: Events, callback: () => void): void {
        if (this.lce) {
            this.lce.off(event, callback);
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
        });
    }
}
