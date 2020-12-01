import { Agent } from "https";
import { CCT } from "../app/CCT";
import { Util } from "../app/Util";

const agent = new Agent({
  rejectUnauthorized: false,
});

describe("CCT tests", () => {
  test("test initialization", async () => {
    const cct = new CCT({
      httpAgent: agent,
      regions: ["Galaxy", "europe-west3"],
    });

    await cct.fetchDatacenterInformation(
      ""
    );

    expect(cct.datacenters.length).toEqual(2);
    expect(cct.datacenters[0].position).toEqual(0);
    expect(cct.datacenters[0].latencies.length).toEqual(0);
    expect(cct.datacenters[0].bandwidths.length).toEqual(0);
    expect(cct.datacenters[0].averageLatency).toEqual(0);
    expect(cct.datacenters[0].averageBandwidth).toEqual({
      bitsPerSecond: 0,
      kiloBitsPerSecond: 0,
      megaBitsPerSecond: 0,
    });
    expect(cct.datacenters[1].position).toEqual(0);
    expect(cct.datacenters[1].latencies.length).toEqual(0);
    expect(cct.datacenters[1].bandwidths.length).toEqual(0);
    expect(cct.datacenters[1].averageLatency).toEqual(0);
    expect(cct.datacenters[1].averageBandwidth).toEqual({
      bitsPerSecond: 0,
      kiloBitsPerSecond: 0,
      megaBitsPerSecond: 0,
    });
  });

  test("test cleanup", async () => {
    const cct = new CCT({
      httpAgent: agent,
      regions: ["Galaxy", "europe-west3"],
    });

    await cct.fetchDatacenterInformation(
      ""
    );
    cct.startLatencyChecks(1);

    while (!cct.finishedLatency) {
      await Util.sleep(50);
    }

    cct.clean();

    expect(cct.datacenters[0].position).toEqual(0);
    expect(cct.datacenters[0].latencies.length).toEqual(0);
    expect(cct.datacenters[0].bandwidths.length).toEqual(0);
    expect(cct.datacenters[0].averageLatency).toEqual(0);
    expect(cct.datacenters[0].averageBandwidth).toEqual({
      bitsPerSecond: 0,
      kiloBitsPerSecond: 0,
      megaBitsPerSecond: 0,
    });
    expect(cct.datacenters[1].position).toEqual(0);
    expect(cct.datacenters[1].latencies.length).toEqual(0);
    expect(cct.datacenters[1].bandwidths.length).toEqual(0);
    expect(cct.datacenters[1].averageLatency).toEqual(0);
    expect(cct.datacenters[1].averageBandwidth).toEqual({
      bitsPerSecond: 0,
      kiloBitsPerSecond: 0,
      megaBitsPerSecond: 0,
    });
  });

  test("check latency", async () => {
    const cct = new CCT({
      httpAgent: agent,
      regions: ["Galaxy", "europe-west3"],
    });

    await cct.fetchDatacenterInformation(
      ""
    );

    expect(cct.datacenters.length).toEqual(2);

    cct.startLatencyChecks(3);

    while (!cct.finishedLatency) {
      await Util.sleep(50);
    }

    expect(cct.finishedLatency).toBeTruthy();
    expect(cct.finishedBandwidth).toBeFalsy();
    expect(cct.datacenters[0].latencies.length).toEqual(3);
    expect(cct.datacenters[1].latencies.length).toEqual(3);
  });

  test("check bandwidth", async () => {
    const cct = new CCT({
      httpAgent: agent,
      regions: ["Galaxy"],
    });

    await cct.fetchDatacenterInformation(
      ""
    );

    expect(cct.datacenters.length).toEqual(1);

    cct.startBandwidthChecks(cct.datacenters[0], 3);

    while (!cct.finishedBandwidth) {
      await Util.sleep(50);
    }

    expect(cct.finishedLatency).toBeFalsy();
    expect(cct.finishedBandwidth).toBeTruthy();
    expect(cct.datacenters[0].bandwidths.length).toEqual(3);
  });

  test("abort running measurement", async () => {
    const cct = new CCT({
      httpAgent: agent,
      regions: ["Galaxy"],
    });

    await cct.fetchDatacenterInformation(
      ""
    );

    expect(cct.datacenters.length).toEqual(1);

    cct.startBandwidthChecks(cct.datacenters[0], 3);

    while (!cct.finishedBandwidth) {
      await Util.sleep(50);
      cct.stopMeasurements();
    }

    expect(cct.finishedLatency).toBeFalsy();
    expect(cct.finishedBandwidth).toBeTruthy();
    expect(cct.datacenters[0].bandwidths.length).not.toEqual(3);
  });
});
