const assert = require('assert');

'use strict';

class LCE {
    constructor({
                    datacenters,
                    droneHostPrefix = 'cct-drone',
                    droneHostDomain,
                }) {

        assert(droneHostDomain, 'Missing parameter: droneHostDomain');
        this.datacenters = datacenters;
        this.droneHost = {
            prefix: droneHostPrefix,
            domain: droneHostDomain
        }
    }

    compare (a,b) {
        if (a.latency < b.latency)
            return -1;
        if (a.latency > b.latency)
            return 1;
        return 0;
    }

    async runAll() {
        const results = [];
        this.datacenters.forEach(datacenter => {
            results.push(this.callDrone(datacenter));
        });

        const pResults = await results;
        const data = await Promise.all(pResults);
        data.sort(this.compare);
        return data;
    }

    async runForId(id) {
        const dc = this.datacenters.find(datacenter => datacenter.id === id);
        if (dc) {
            return this.callDrone(dc);
        }
    }

    calcDroneHost(datacenter) {
        return `${this.droneHost.prefix}-${datacenter.name}.${this.droneHost.domain}`;
    }

    async callDrone(datacenter) {
        const start = Date.now();
        const response = await fetch(`//${calcDroneHost(datacenter)}`);
        const contentLength = response.headers.get('content-length');
        const end = Date.now();

        return {
            id: datacenter.id,
            latency: end - start,
            contentLength: contentLength,
            cloud: datacenter.cloud,
            name: datacenter.name,
            town: datacenter.town,
            country: datacenter.country,
            latitude: datacenter.latitude,
            longitude: datacenter.longitude,
            ip: datacenter.ip
        }
    }

}

module.exports = LCE;
