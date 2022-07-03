import {v4 as uuid} from 'uuid';
import fetch, {Response} from 'node-fetch';
import {Datacenter, filterKeys, Location, Speed, StoreData} from '../@types/Datacenter';
import {LCE} from './LCE';
import {Util} from './Util';
import {BandwidthMode, BandwithPerSecond} from '../@types/Bandwidth';
import GeocoderResult = google.maps.GeocoderResult;

export class CCT {
    allDatacenters: Datacenter[];
    datacenters: Datacenter[];
    lce: LCE;
    finishedLatency = false;
    finishedBandwidth = false;

    async fetchDatacenterInformationRequest(dictionaryUrl: string): Promise<Datacenter[]> {
        try {
            return await fetch(dictionaryUrl).then((res: Response) => res.json());
        } catch {
            return [];
        }
    }

    async fetchDatacenterInformation(dictionaryUrl: string): Promise<void> {
        this.allDatacenters = await this.fetchDatacenterInformationRequest(dictionaryUrl);

        this.datacenters = this.allDatacenters;

        this.clean();

        this.lce = new LCE(this.datacenters);
    }

    setFilters(filters: filterKeys | undefined) {
        this.datacenters = filters
            ? this.allDatacenters.filter((dc) =>
                  Object.keys(filters).every((key) => {
                      // @ts-ignore
                      return filters[key].includes(dc[key]);
                  })
              )
            : this.allDatacenters;

        this.lce = new LCE(this.datacenters);
    }

    stopMeasurements(): void {
        this.lce.terminate();
    }

    async startLatencyChecks(iterations: number): Promise<void> {
        await this.startMeasurementForLatency(iterations);
        this.finishedLatency = true;
    }

    private async startMeasurementForLatency(iterations: number): Promise<void> {
        for (let i = 0; i < iterations; i++) {
            for (let dcLength = 0; dcLength < this.datacenters.length; dcLength++) {
                const dc = this.datacenters[dcLength];
                const result = await this.lce.getLatencyForId(dc.id);
                if (result && result.latency) {
                    const index = this.datacenters.findIndex((e) => e.id === dc.id);

                    this.datacenters[index].latencies?.push(result.latency);
                    const averageLatency = Util.getAverageLatency(this.datacenters[index].latencies);
                    this.datacenters[index].averageLatency = averageLatency;
                    this.datacenters[index].latencyJudgement = this.judgeLatency(averageLatency);
                }
            }
        }
    }

    async startBandwidthChecks({
        datacenter,
        iterations,
        bandwidthMode,
    }: {
        datacenter: Datacenter | Datacenter[];
        iterations: number;
        bandwidthMode?: BandwidthMode | undefined;
    }): Promise<void> {
        if (Array.isArray(datacenter)) {
            const bandwidthMeasurementPromises: Promise<void>[] = [];
            datacenter.forEach((dc) => {
                bandwidthMeasurementPromises.push(this.startMeasurementForBandwidth(dc, iterations, bandwidthMode));
            });
            await Promise.all(bandwidthMeasurementPromises);
            this.finishedBandwidth = true;
        } else {
            await this.startMeasurementForBandwidth(datacenter, iterations, bandwidthMode);
            this.finishedBandwidth = true;
        }
    }

    private async startMeasurementForBandwidth(
        dc: Datacenter,
        iterations: number,
        bandwidthMode: BandwidthMode = BandwidthMode.big
    ): Promise<void> {
        for (let i = 0; i < iterations; i++) {
            const result = await this.lce.getBandwidthForId(dc.id, {bandwidthMode});
            if (result && result.bandwidth) {
                const index = this.datacenters.findIndex((e) => e.id === dc.id);

                this.datacenters[index].bandwidths?.push(result.bandwidth);
                const averageBandwidth = Util.getAverageBandwidth(this.datacenters[index].bandwidths);
                this.datacenters[index].averageBandwidth = averageBandwidth;
                this.datacenters[index].bandwidthJudgement = this.judgeBandwidth(averageBandwidth);
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

    async storeRequest(body: any) {
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
        this.datacenters.forEach((dc) => {
            data.push({
                id: dc.id,
                latency: `${dc.averageLatency.toFixed(2)}`,
                averageBandwidth: dc.averageBandwidth.megaBitsPerSecond.toFixed(2),
            });
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
        this.finishedLatency = false;
        this.finishedBandwidth = false;
    }
}
