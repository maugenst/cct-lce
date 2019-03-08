const fetch = require('node-fetch');

class LCE {
  constructor({
    datacenters,
    droneHostPrefix = 'cct-drone',
    droneHostDomain,
  }) {
    if (!droneHostDomain) {
      throw new Error('Missing parameter: droneHostDomain');
    }
    this.datacenters = datacenters;
    this.droneHost = {
      prefix: droneHostPrefix,
      domain: droneHostDomain,
    };
  }

  compare(a, b) {
    if (a.latency < b.latency) return -1;
    if (a.latency > b.latency) return 1;
    return 0;
  }

  async runLatencyCheckForAll() {
    const results = [];
    this.datacenters.forEach((datacenter) => {
      results.push(this.getLatencyFor(datacenter));
    });

    const pResults = await results;
    const data = await Promise.all(pResults);
    data.sort(this.compare);
    return data;
  }

  calcDroneHost(datacenter) {
    return `${this.droneHost.prefix}-${datacenter.name}.${this.droneHost.domain}`;
  }

  static calcBandwidth(downloadSize, latency) {
    const duration = latency / 1000;
    const bitsLoaded = downloadSize * 8;
    const speedBps = (bitsLoaded / duration).toFixed(2);
    const speedKbps = (speedBps / 1024).toFixed(2);
    const speedMbps = (speedKbps / 1024).toFixed(2);
    return {
      speedBps,
      speedKbps,
      speedMbps,
    };
  }

  async getBandwidthForIds(idarray) {
    idarray.forEach(id => this.getBandwidthForId(id));
  }

  async getBandwidthForId(id) {
    const dc = this.datacenters.find(datacenter => datacenter.id === id);
    if (!dc) {
      return null;
    }
    return this.getBandwidthFor(dc);
  }


  async getBandwidthFor(datacenter) {
    const start = Date.now();
    const response = await fetch(`https://${this.calcDroneHost(datacenter)}/drone/big`);
    const end = Date.now();
    const text = await response.text();
    const contentLength = text.split('\n')[0];
    const bandwidth = LCE.calcBandwidth(contentLength, end - start);

    return {
      id: datacenter.id,
      bandwidth,
      cloud: datacenter.cloud,
      name: datacenter.name,
      town: datacenter.town,
      country: datacenter.country,
      latitude: datacenter.latitude,
      longitude: datacenter.longitude,
      ip: datacenter.ip,
    };
  }

  async getLatencyForIds(idarray) {
    idarray.forEach(id => this.getLatencyForId(id));
  }

  async getLatencyForId(id) {
    const dc = this.datacenters.find(datacenter => datacenter.id === id);
    if (!dc) {
      return null;
    }
    return this.getLatencyFor(dc);
  }

  async getLatencyFor(datacenter) {
    const start = Date.now();
    await fetch(`https://${this.calcDroneHost(datacenter)}/drone`);
    const end = Date.now();

    return {
      id: datacenter.id,
      latency: end - start,
      cloud: datacenter.cloud,
      name: datacenter.name,
      town: datacenter.town,
      country: datacenter.country,
      latitude: datacenter.latitude,
      longitude: datacenter.longitude,
      ip: datacenter.ip,
    };
  }
}

module.exports = LCE;
