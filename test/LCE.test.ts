// import {LCE} from '../app/LCE';
// import {Datacenter} from '../@types/Datacenter';
//
// const datacenters: Datacenter[] = [
//     {
//         id: '07fe49e2-795b-4f06-9908-436e6dc21042',
//         cloud: 'gcp',
//         name: 'us-west1',
//         town: 'The Dalles, Oregon',
//         country: 'USA',
//         latitude: '45.609579600000',
//         longitude: '-121.243900200000',
//         ip: 'cct-drone-gcp-us-west1.demo-education.cloud.sap',
//         tags: 'test',
//         lastUpdate: '2019-04-12T08:24:04.000Z',
//         position: 1,
//         averageLatency: 123,
//         averageBandwidth: {
//             bitsPerSecond: 123,
//             kiloBitsPerSecond: 123,
//             megaBitsPerSecond: 123,
//         },
//         latencies: [
//             {value: 123, timestamp: 123},
//             {value: 123, timestamp: 123},
//             {value: 123, timestamp: 123},
//         ],
//         bandwidths: [
//             {
//                 timestamp: 123,
//                 value: {bitsPerSecond: 123, kiloBitsPerSecond: 123, megaBitsPerSecond: 123},
//             },
//             {
//                 timestamp: 123,
//                 value: {bitsPerSecond: 123, kiloBitsPerSecond: 123, megaBitsPerSecond: 123},
//             },
//             {
//                 timestamp: 123,
//                 value: {bitsPerSecond: 123, kiloBitsPerSecond: 123, megaBitsPerSecond: 123},
//             },
//         ],
//     },
//     {
//         id: '1764db7a-7827-4c68-aba2-6031cdd11503',
//         cloud: 'gcp',
//         name: 'us-west2',
//         town: 'Los Angeles, California',
//         country: 'USA',
//         latitude: '34.020346400000',
//         longitude: '-118.972172000000',
//         ip: 'cct-drone-gcp-us-west2.demo-education.cloud.sap',
//         tags: 'test',
//         lastUpdate: '2019-04-12T08:24:04.000Z',
//         position: 1,
//         averageLatency: 123,
//         averageBandwidth: {
//             bitsPerSecond: 123,
//             kiloBitsPerSecond: 123,
//             megaBitsPerSecond: 123,
//         },
//         latencies: [
//             {value: 123, timestamp: 123},
//             {value: 123, timestamp: 123},
//             {value: 123, timestamp: 123},
//         ],
//         bandwidths: [
//             {
//                 timestamp: 123,
//                 value: {bitsPerSecond: 123, kiloBitsPerSecond: 123, megaBitsPerSecond: 123},
//             },
//             {
//                 timestamp: 123,
//                 value: {bitsPerSecond: 123, kiloBitsPerSecond: 123, megaBitsPerSecond: 123},
//             },
//             {
//                 timestamp: 123,
//                 value: {bitsPerSecond: 123, kiloBitsPerSecond: 123, megaBitsPerSecond: 123},
//             },
//         ],
//     },
//     {
//         id: '1991775f-1f04-46f2-987a-9979d6dfff1f',
//         cloud: 'gcp',
//         name: 'asia-southeast1',
//         town: 'Jurong West',
//         country: 'Singapore',
//         latitude: '1.344059500000',
//         longitude: '103.666527500000',
//         ip: 'cct-drone-gcp-asia-southeast1.demo-education.cloud.sap',
//         tags: 'test',
//         lastUpdate: '2019-04-12T08:24:05.000Z',
//         position: 1,
//         averageLatency: 123,
//         averageBandwidth: {
//             bitsPerSecond: 123,
//             kiloBitsPerSecond: 123,
//             megaBitsPerSecond: 123,
//         },
//         latencies: [
//             {value: 123, timestamp: 123},
//             {value: 123, timestamp: 123},
//             {value: 123, timestamp: 123},
//         ],
//         bandwidths: [
//             {
//                 timestamp: 123,
//                 value: {bitsPerSecond: 123, kiloBitsPerSecond: 123, megaBitsPerSecond: 123},
//             },
//             {
//                 timestamp: 123,
//                 value: {bitsPerSecond: 123, kiloBitsPerSecond: 123, megaBitsPerSecond: 123},
//             },
//             {
//                 timestamp: 123,
//                 value: {bitsPerSecond: 123, kiloBitsPerSecond: 123, megaBitsPerSecond: 123},
//             },
//         ],
//     },
//     {
//         id: '2c59733c-5eb5-4e28-8eb5-a66f553adc1e',
//         cloud: 'gcp',
//         name: 'europe-west3',
//         town: 'Frankfurt',
//         country: 'Germany',
//         latitude: '50.121127700000',
//         longitude: '8.496482000000',
//         ip: 'cct-drone-gcp-europe-west3.demo-education.cloud.sap',
//         tags: 'test',
//         lastUpdate: '2019-04-12T08:24:04.000Z',
//         position: 1,
//         averageLatency: 123,
//         averageBandwidth: {
//             bitsPerSecond: 123,
//             kiloBitsPerSecond: 123,
//             megaBitsPerSecond: 123,
//         },
//         latencies: [
//             {value: 123, timestamp: 123},
//             {value: 123, timestamp: 123},
//             {value: 123, timestamp: 123},
//         ],
//         bandwidths: [
//             {
//                 timestamp: 123,
//                 value: {bitsPerSecond: 123, kiloBitsPerSecond: 123, megaBitsPerSecond: 123},
//             },
//             {
//                 timestamp: 123,
//                 value: {bitsPerSecond: 123, kiloBitsPerSecond: 123, megaBitsPerSecond: 123},
//             },
//             {
//                 timestamp: 123,
//                 value: {bitsPerSecond: 123, kiloBitsPerSecond: 123, megaBitsPerSecond: 123},
//             },
//         ],
//     },
// ];
//
// beforeAll(() => {
//     jest.setTimeout(300000);
//     process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// });

describe('lce-tests', () => {
    // test('test object creation', async () => {
    //     const lce = new LCE(datacenters);
    //
    //     expect(lce.datacenters.length).toEqual(4);
    // });
    //
    // test('test - drone latency', async () => {
    //     const lce = new LCE(datacenters);
    //     const latency = await lce.getLatencyFor({
    //         id: 'f283eadf-2165-4bdd-9c72-cce04b881c7a',
    //         cloud: 'gcp',
    //         name: 'europe-west2',
    //         town: 'London',
    //         country: 'United Kingdom',
    //         latitude: '51.528161300000',
    //         longitude: '-0.662001000000',
    //         tags: 'test',
    //         ip: 'cct-drone-gcp-europe-west2.demo-education.cloud.sap',
    //         lastUpdate: '2019-04-12T08:24:05.000Z',
    //         position: 1,
    //         averageLatency: 123,
    //         averageBandwidth: {
    //             bitsPerSecond: 123,
    //             kiloBitsPerSecond: 123,
    //             megaBitsPerSecond: 123,
    //         },
    //         latencies: [
    //             {value: 123, timestamp: 123},
    //             {value: 123, timestamp: 123},
    //             {value: 123, timestamp: 123},
    //         ],
    //         bandwidths: [
    //             {
    //                 timestamp: 123,
    //                 value: {bitsPerSecond: 123, kiloBitsPerSecond: 123, megaBitsPerSecond: 123},
    //             },
    //             {
    //                 timestamp: 123,
    //                 value: {bitsPerSecond: 123, kiloBitsPerSecond: 123, megaBitsPerSecond: 123},
    //             },
    //             {
    //                 timestamp: 123,
    //                 value: {bitsPerSecond: 123, kiloBitsPerSecond: 123, megaBitsPerSecond: 123},
    //             },
    //         ],
    //     });
    //     expect(latency).toBeDefined();
    //     expect(latency?.latency).toBeDefined();
    //     expect(latency && latency.latency > 1).toBe(true);
    //
    //     const bandwidth = await lce.getBandwidthFor({
    //         id: 'f283eadf-2165-4bdd-9c72-cce04b881c7a',
    //         cloud: 'gcp',
    //         name: 'europe-west2',
    //         town: 'London',
    //         country: 'United Kingdom',
    //         latitude: '51.528161300000',
    //         longitude: '-0.662001000000',
    //         tags: 'test',
    //         ip: 'cct-drone-gcp-europe-west2.demo-education.cloud.sap',
    //         lastUpdate: '2019-04-12T08:24:05.000Z',
    //         position: 1,
    //         averageLatency: 123,
    //         averageBandwidth: {
    //             bitsPerSecond: 123,
    //             kiloBitsPerSecond: 123,
    //             megaBitsPerSecond: 123,
    //         },
    //         latencies: [
    //             {value: 123, timestamp: 123},
    //             {value: 123, timestamp: 123},
    //             {value: 123, timestamp: 123},
    //         ],
    //         bandwidths: [
    //             {
    //                 timestamp: 123,
    //                 value: {bitsPerSecond: 123, kiloBitsPerSecond: 123, megaBitsPerSecond: 123},
    //             },
    //             {
    //                 timestamp: 123,
    //                 value: {bitsPerSecond: 123, kiloBitsPerSecond: 123, megaBitsPerSecond: 123},
    //             },
    //             {
    //                 timestamp: 123,
    //                 value: {bitsPerSecond: 123, kiloBitsPerSecond: 123, megaBitsPerSecond: 123},
    //             },
    //         ],
    //     });
    //     expect(bandwidth).toBeDefined();
    //     expect(bandwidth?.bandwidth).toBeDefined();
    //     expect(bandwidth?.bandwidth.bitsPerSecond).toBeDefined();
    //     expect(bandwidth?.bandwidth.kiloBitsPerSecond).toBeDefined();
    //     expect(bandwidth?.bandwidth.megaBitsPerSecond).toBeDefined();
    // });
    //
    // test('test - drone bandwidth by id', async () => {
    //     const lce = new LCE(datacenters);
    //     const bandwidth = await lce.getBandwidthForId('2c59733c-5eb5-4e28-8eb5-a66f553adc1e');
    //     expect(bandwidth).toBeDefined();
    //     expect(bandwidth?.bandwidth).toBeDefined();
    //
    //     expect(bandwidth?.bandwidth.bitsPerSecond).toBeDefined();
    //     expect(bandwidth?.bandwidth.kiloBitsPerSecond).toBeDefined();
    //     expect(bandwidth?.bandwidth.megaBitsPerSecond).toBeDefined();
    // });
    //
    // test('test - drone bandwidth and cancel download', async () => {
    //     const lce = new LCE(datacenters);
    //     if (lce !== null) {
    //         await lce.getBandwidthForId('2c59733c-5eb5-4e28-8eb5-a66f553adc1e');
    //
    //         lce.terminate();
    //         expect(lce.cancelableBandwidthRequests.length).toEqual(0);
    //
    //         const bandwidth = await lce.getBandwidthForId('2c59733c-5eb5-4e28-8eb5-a66f553adc1e');
    //         expect(bandwidth).toBeDefined();
    //         expect(bandwidth?.bandwidth).toBeDefined();
    //         expect(bandwidth?.bandwidth.bitsPerSecond).toBeDefined();
    //         expect(bandwidth?.bandwidth.kiloBitsPerSecond).toBeDefined();
    //         expect(bandwidth?.bandwidth.megaBitsPerSecond).toBeDefined();
    //     }
    // });
    //
    // test('test - drone all latencies', async () => {
    //     const lce = new LCE(datacenters);
    //     const latencies = await lce.runLatencyCheckForAll();
    //     expect(latencies && latencies.length > 0).toBeTruthy();
    // });
    //
    // test('test - drone all bandwidths', async () => {
    //     const lce = new LCE([datacenters[0]]);
    //     const bandwidth = await lce.runBandwidthCheckForAll();
    //     expect(bandwidth && bandwidth.length > 0).toBeTruthy();
    // });
    // more to come ...
});
