"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CCT_1 = require("../app/CCT");
const Util_1 = require("../app/Util");
class TestAll {
    async start() {
        const cct = new CCT_1.CCT({
            regions: ["Galaxy", "europe-west3", "europe-west4", "europe-west2"],
        });
        await cct.fetchDatacenterInformation(process.env.CCT_DICTIONARY_URL);
        cct.startLatencyChecks(19);
        while (!cct.finishedLatency) {
            const dcs = cct.getCurrentDatacentersSorted();
            console.log(`${dcs[0].name}[${dcs[0].averageLatency}] ${dcs[1].name}[${dcs[1].averageLatency}] ${dcs[2].name}[${dcs[2].averageLatency}]`);
            await Util_1.Util.sleep(100);
        }
        let dcs = cct.getCurrentDatacentersSorted();
        console.log(`Best Datacenter: ${dcs[0].name} --> Average Latency: ${dcs[0].averageLatency}`);
        cct.startBandwidthChecks(dcs[0], 4);
        while (!cct.finishedBandwidth) {
            const dcs = cct.getCurrentDatacentersSorted();
            console.log(`${dcs[0].name}[${dcs[0].averageBandwidth.megaBitsPerSecond}]`);
            await Util_1.Util.sleep(50);
        }
        dcs = cct.getCurrentDatacentersSorted();
        console.log(`Best Datacenter: ${dcs[0].name} --> Average Latency [ms]: ${dcs[0].averageLatency.toFixed(2)} --> Average Bandwidth [Mbit/s]: ${dcs[0].averageBandwidth.megaBitsPerSecond.toFixed(2)}`);
        console.log(`All Latencies: ${dcs[0].latencies}`);
        console.log(`All Bandwidths: ${JSON.stringify(dcs[0].bandwidths, null, 2)}`);
        cct.clean();
    }
}
const t = new TestAll();
t.start();
//# sourceMappingURL=TestAll.js.map