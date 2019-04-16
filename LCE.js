const fetch = require('node-fetch');

class LCE {
  constructor({
    datacenters,
  }) {
    this.datacenters = datacenters;
    this.cancelableLatencyRequests = [];
    this.cancelableBandwidthRequests = [];
    this.blockedUrls = {};
  }

  async runLatencyCheckForAll() {
    const results = [];
    this.datacenters.forEach((datacenter) => {
      results.push(this.getLatencyFor(datacenter));
    });

    const pResults = await results;
    const data = await Promise.all(pResults);
    // filter failed requests
    const filteredData = data.filter(d => d !== null);
    filteredData.sort(this.compare);
    this.cancelableLatencyRequests = [];
    return filteredData;
  }

  async runBandwidthCheckForAll() {
    const results = [];
    this.datacenters.forEach((datacenter) => {
      results.push(this.getBandwidthFor(datacenter));
    });

    const pResults = await results;
    const data = await Promise.all(pResults);
    const filteredData = data.filter(d => d !== null);
    filteredData.sort(this.compare);
    this.cancelableBandwidthRequests = [];
    return filteredData;
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
    try {
      const start = Date.now();
      await this.latencyFetch(`https://${datacenter.ip}/drone/index.html`);
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
    } catch (error) {
      return null;
    }
  }

  async getBandwidthFor(datacenter) {

    const start = Date.now();
    const response = await this.bandwidthFetch(`https://${datacenter.ip}/drone/big`);
    if (response !== null) {
      const end = Date.now();
      const rawBody = await response.text();
      const bandwidth = LCE.calcBandwidth(rawBody.length, end - start);

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
    }else {
      return null;
    }
  }

  bandwidthFetch(url) {
    const controller = new AbortController();
    const {
      signal
    } = controller;
    this.cancelableBandwidthRequests.push(controller);
    return this.abortableFetch(url, signal);
  }

  latencyFetch(url) {
    const controller = new AbortController();
    const {
      signal
    } = controller;
    this.cancelableLatencyRequests.push(controller);
    return this.abortableFetch(url, signal);
  }

  async abortableFetch(url, signal) {
    try {
      const response = await fetch(url, {
        cache: 'no-store',
        signal,
      });
      return response;
    } catch (error) {
      return null;
    }
  }

  compare(a, b) {
    if (a.latency < b.latency) return -1;
    if (a.latency > b.latency) return 1;
    return 0;
  }

  terminate() {
    this.cancelableLatencyRequests.forEach((controller) => {
      controller.abort();
    });
    this.cancelableBandwidthRequests.forEach((controller) => {
      controller.abort();
    });
    this.cancelableLatencyRequests = [];
    this.cancelableBandwidthRequests = [];
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