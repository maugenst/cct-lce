import { Agent } from "https";
import { CCT } from "../app/CCT";
import { Util } from "../app/Util";

const agent = new Agent({
  rejectUnauthorized: false,
});

class TestAll {
  async start() {
    const cct = new CCT({
      httpAgent: agent,
      regions: ["Galaxy", "europe-west3", "europe-west4", "europe-west2"],
    });

    await cct.fetchDatacenterInformation('https://cct.demo-education.cloud.sap/datacenters');

    cct.startLatencyChecks(19);

    while (!cct.finishedLatency) {
      const dcs = cct.getCurrentDatacentersSorted();
      console.log(
        `${dcs[0].name}[${dcs[0].averageLatency}] ${dcs[1].name}[${dcs[1].averageLatency}] ${dcs[2].name}[${dcs[2].averageLatency}]`
      );
      await Util.sleep(100);
    }
    let dcs = cct.getCurrentDatacentersSorted();
    console.log(
      `Best Datacenter: ${dcs[0].name} --> Average Latency: ${dcs[0].averageLatency}`
    );

    cct.startBandwidthChecks(dcs[0], 4);

    while (!cct.finishedBandwidth) {
      const dcs = cct.getCurrentDatacentersSorted();
      console.log(
        `${dcs[0].name}[${dcs[0].averageBandwidth.megaBitsPerSecond}]`
      );
      await Util.sleep(50);
    }
    dcs = cct.getCurrentDatacentersSorted();
    console.log(
      `Best Datacenter: ${dcs[0].name} --> Average Latency [ms]: ${dcs[0].averageLatency.toFixed(2)} --> Average Bandwidth [Mbit/s]: ${dcs[0].averageBandwidth.megaBitsPerSecond.toFixed(2)}`
    );

    console.log(`All Latencies: ${dcs[0].latencies}`);
    console.log(`All Bandwidths: ${JSON.stringify(dcs[0].bandwidths, null, 2)}`);
    cct.clean();
  }
}

const t = new TestAll();
t.start();