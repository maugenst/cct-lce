const { XMLHttpRequest } = require('xmlhttprequest');

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
    this.cancelableLatencyRequests = [];
    this.cancelableBandwidthRequests = [];
  }

  async runLatencyCheckForAll() {
    const results = [];
    this.datacenters.forEach((datacenter) => {
      results.push(this.getLatencyFor(datacenter));
    });

    const pResults = await results;
    const data = await Promise.all(pResults);
    data.sort(this.compare);
    this.cancelableLatencyRequests = [];
    return data;
  }

  async runBandwidthCheckForAll() {
    const results = [];
    this.datacenters.forEach((datacenter) => {
      results.push(this.getBandwidthFor(datacenter));
    });

    const pResults = await results;
    const data = await Promise.all(pResults);
    this.cancelableBandwidthRequests = [];
    return data;
  }

  getBandwidthForId(id) {
    const dc = this.datacenters.find(datacenter => datacenter.id === id);
    if (!dc) {
      return null;
    }
    return this.getBandwidthFor(dc);
  }

  getLatencyForId(id) {
    const dc = this.datacenters.find(datacenter => datacenter.id === id);
    if (!dc) {
      return null;
    }
    return this.getLatencyFor(dc);
  }

  async getLatencyFor(datacenter) {
    const start = Date.now();
    await this.latencyFetch(`https://${this.calcDroneHost(datacenter)}/drone`);
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

  async getBandwidthFor(datacenter) {
    const start = Date.now();
    const response = await this.bandwidthFetch(`https://${this.calcDroneHost(datacenter)}/drone/big`);
    const end = Date.now();
    const contentLength = response.length;
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

  bandwidthFetch(url) {
    const xhr = new XMLHttpRequest();
    this.cancelableBandwidthRequests.push(xhr);
    return this.fetch(url, xhr);
  }

  latencyFetch(url) {
    const xhr = new XMLHttpRequest();
    this.cancelableLatencyRequests.push(xhr);
    return this.fetch(url, xhr);
  }

  fetch(url, xhr) {
    return new Promise((resolve, reject) => {
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.response || xhr.responseText);
          } else {
            reject(new Error('Request aborted.'));
          }
        }
      };
      xhr.open('GET', url, true);
      xhr.setRequestHeader('Cache-Control', 'no-cache');
      xhr.send();
    });
  }

  compare(a, b) {
    if (a.latency < b.latency) return -1;
    if (a.latency > b.latency) return 1;
    return 0;
  }

  terminate() {
    this.cancelableLatencyRequests.forEach((xhr) => {
      xhr.abort();
    });
    this.cancelableBandwidthRequests.forEach((xhr) => {
      xhr.abort();
    });
    this.cancelableLatencyRequests = [];
    this.cancelableBandwidthRequests = [];
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
}

module.exports = LCE;
