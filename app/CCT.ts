import {v4 as uuid} from 'uuid';
import fetch, {Response} from 'node-fetch';
import {Datacenter, Location, Speed, StoreData} from '../@types/Datacenter';
import {LCE} from './LCE';
import {Util} from './Util';
import {BandwidthMode, BandwithPerSecond} from '../@types/Bandwidth';
import GeocoderResult = google.maps.GeocoderResult;

export class CCT {
    allDatacenters: Datacenter[];
    datacenters: Datacenter[];
    regions: string[];
    lce: LCE;
    finishedLatency = false;
    finishedBandwidth = false;

    async fetchDatacenterInformation(dictionaryUrl: string | undefined): Promise<void> {
        if (!dictionaryUrl) {
            throw new Error('Datacenter URL missing.');
        }

        this.allDatacenters = await fetch(dictionaryUrl).then((res: Response) => res.json());

        this.datacenters = this.allDatacenters;

        this.clean();

        this.lce = new LCE(this.datacenters);
    }

    setRegions(regions: string[]): void {
        this.regions = regions || [];
        this.datacenters =
            this.regions.length > 0
                ? this.allDatacenters.filter((dc) => this.mapDatacentersOnRegions(dc))
                : this.allDatacenters;

        this.lce = new LCE(this.datacenters);
    }

    private mapDatacentersOnRegions(dc: Datacenter): boolean {
        return this.regions.map((region) => dc.name.toLowerCase() === region.toLowerCase()).reduce((a, b) => a || b);
    }

    stopMeasurements(): void {
        this.lce.terminate();
    }

    startLatencyChecks(iterations: number): void {
        this.startMeasurementForLatency(iterations).then(() => {
            this.finishedLatency = true;
        });
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

    startBandwidthChecks({
        datacenter,
        iterations,
        bandwidthMode,
    }: {
        datacenter: Datacenter | Datacenter[];
        iterations: number;
        bandwidthMode?: BandwidthMode | undefined;
    }): void {
        if (Array.isArray(datacenter)) {
            const bandwidthMeasurementPromises: Promise<void>[] = [];
            datacenter.forEach((dc) => {
                bandwidthMeasurementPromises.push(this.startMeasurementForBandwidth(dc, iterations, bandwidthMode));
            });
            Promise.all(bandwidthMeasurementPromises).then(() => {
                this.finishedBandwidth = true;
            });
        } else {
            this.startMeasurementForBandwidth(datacenter, iterations, bandwidthMode).then(() => {
                this.finishedBandwidth = true;
            });
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

        // console.log(body);
        try {
            const result = await fetch('https://cct.demo-education.cloud.sap/measurement', {
                method: 'post',
                body: body,
                headers: {'Content-Type': 'application/json'},
            }).then((res: Response) => res.json());
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
