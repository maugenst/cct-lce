# CCT-LCE Documentation

CCT-LCE is specifically tailored for managing and monitoring data centers, with a primary focus on measuring and analyzing latency and bandwidth metrics. This documentation provides a comprehensive overview of the methods and properties available in the cct-lce.

## Table of Contents

- [Properties](#properties)
  - [allDatacenters](#alldatacenters)
  - [datacenters](#datacenters)
  - [runningLatency](#runningLatency)
  - [runningBandwidth](#runningBandwidth)
  - [compatibleDCsWithSockets](#compatibleDCsWithSockets)
- [Methods](#methods)
  - [fetchDatacenterInformation](#fetchdatacenterinformation)
  - [fetchCompatibleDCsWithSockets](#fetchcompatibledcswithsockets)
  - [setFilters](#setfilters)
  - [stopMeasurements](#stopmeasurements)
  - [clean](#clean)
  - [setIdToExclude](#setIdToExclude)
  - [startLatencyChecks](#startlatencychecks)
  - [startBandwidthChecks](#startbandwidthchecks)
  - [getCurrentDatacentersSorted](#getcurrentdatacenterssorted)
  - [getAddress](#getaddress)
  - [store](#store)
  - [getClosestDatacenters](#getclosestdatacenters)
- [Events](#events)
- [Cloud2Cloud](#cloud2cloud)
- [Types](#types)
  - [Datacenter](#datacenter)
  - [LatencyChecksParams](#latencychecksparams)
  - [BandwidthChecksParams](#bandwidthchecksparams)
  - [Location](#location)
  - [LatencyEventData](#latencyeventdata)
  - [IterationLatencyEventData](#iterationlatencyeventdata)
  - [BandwidthEventData](#bandwidtheventdata)
  - [IterationBandwidthEventData](#iterationbandwidtheventdata)
  - [FilterKeys](#filterkeys)
---

## Properties

### allDatacenters

An array initially empty, designated to store all known data centers. It is populated following the execution of the [fetchDatacenterInformation](#fetchdatacenterinformation) request.

### datacenters

A dynamically managed subset of the [allDatacenters](#alldatacenters) array. Initially, it is filled following the successful execution of the [fetchDatacenterInformation](#fetchdatacenterinformation) request. Subsequently, its contents can be modified in response to the [setFilters](#setfilters) request, which adjusts which data centers are included based on the specified filtering criteria.

### runningLatency

A boolean flag indicating whether latency measurements are currently active. When set to `true`, it signifies that latency monitoring processes are ongoing.

### runningBandwidth

A boolean flag indicating whether bandwidth measurements are currently active. When set to `true`, it signifies that bandwidth monitoring processes are ongoing.

### compatibleDCsWithSockets

An array containing data centers that have been identified as compatible with socket connections. It is populated following the execution of the [fetchCompatibleDCsWithSockets](#fetchcompatibledcswithsockets) request.

## Methods

### fetchDatacenterInformation

This method retrieves information about data centers from a specified URL and stores the data internally for further processing.

**Parameters:**

- `dictionaryUrl` (string, optional): The URL from which data center information is fetched.
  - default: `https://cct.demo-education.cloud.sap/datacenters?isActive=true`

**Example Usage:**

```typescript
const cct = new CCT();

await cct.fetchDatacenterInformation('https://api.example.com/datacenters');

console.log(cct.allDatacenters, cct.datacenters) // fetched datacenters is here.
```

### fetchCompatibleDCsWithSockets

Identifies data centers that are equipped to handle socket connections and updates the internal records with this information.

**Returns:**

- Promise<[Datacenter](#datacenter)[]>: Returns a promise that resolves to an array of data centers that support socket connections.

**Example:**

```typescript
const cct = new CCT();

const compatibleDCs = await cct.fetchCompatibleDCsWithSockets();

console.log(cct.compatibleDCsWithSockets) // fetched datacenters is here.
```

### setFilters

Applies filtering criteria to the list of data centers based on various attributes.

**Parameters:**

- `filters`([FilterKeys](#filterkeys), optional): Criteria to filter the data centers. Possible keys include:
  - `name` (string[], optional): Datacenter names.
  - `cloud` (string[], optional): Associated cloud services.
  - `town` (string[], optional): Towns.
  - `country` (string[], optional): Countries.
  - `tags` (string[], optional): Miscellaneous tags.

**Example:**

```typescript
const cct = new CCT();

await cct.fetchDatacenterInformation('https://api.example.com/datacenters');

cct.setFilters({ country: ['USA', 'Canada'] });

console.log(cct.datacenters) // filtered datacenters
```

### stopMeasurements

Stops all ongoing measurement processes and clears related resources.

**Example:**

```typescript
const cct = new CCT();

await cct.fetchDatacenterInformation('https://api.example.com/datacenters');

cct.startLatencyChecks({ iterations: 10, interval: 1000 });

await delay(3000) // wait for 3s

cct.stopMeasurements(); // will stop latency measurements after 3s
```

### clean

Cleans latency and bandwidth calculations for all datacenters. Fields that are cleaned:

- `position`
- `averageLatency`
- `latencies`
- `latencyJudgement`
- `averageBandwidth`
- `bandwidths`
- `bandwidthJudgement`

**Example:**

```typescript
const cct = new CCT();

await cct.fetchDatacenterInformation('https://api.example.com/datacenters');

await cct.startLatencyChecks({ iterations: 10, interval: 1000 });

console.log(cct.datacenters[0].latencies.length) // 10

cct.clean()

console.log(cct.datacenters[0].latencies.length) // 0
```

### setIdToExclude

Excludes datacenters from datacenters list by id. 

Example of use: Use this when you're making cloud-to-cloud measurements (by using the `from` parameter in [startBandwidthChecks](#startbandwidthchecks) or [startLatencyChecks](#startlatencychecks)). Exclude the data center where the measurements start (source data center), because this data center does not perform measurements on itself, so any results for it would be empty.

**Parameters:**

- `ids` (string[]): Ids of datacenters you want to exclude from datacetners list.

**Example:**

```typescript
const cct = new CCT();

await cct.fetchDatacenterInformation(); // fetch datacenters

await cct.fetchCompatibleDCsWithSockets(); // check which datacenters can initiate measurements (cloud2cloud)

console.log(cct.datacenters.length) // N

cct.setIdToExclude(["id_of_compatible_dc"]);

console.log(cct.datacenters.length) // N - 1

await cct.startLatencyChecks({ iterations: 10, interval: 1000, from: "id_of_compatible_dc" });
```

### startLatencyChecks

This method initiates the process of measuring latency for data centers according to specified criteria.

**Parameters:**

- `params` ([LatencyChecksParams](#latencychecksparams)): Configuration options for latency tests.
    - `interval` (number, optional): Time in milliseconds between each latency check.
      - default: 0 
    - `iterations` (number, optional): Total number of latency checks to be performed.
      - default: 16
    - `save` (boolean, optional): Specifies whether to save the latency results.
      - default: true
    - `from` (string, optional): The ID of the data center from which latency is specifically measured.
      - default: undefined

**Example:**

```typescript
const cct = new CCT();

await cct.fetchDatacenterInformation('https://api.example.com/datacenters');

await cct.startLatencyChecks({ iterations: 10, interval: 1000 });
```

### startBandwidthChecks

This method initiates the process of measuring bandwidth for data centers according to specified criteria.

**Parameters:**

- `params` ([BandwidthChecksParams](#bandwidthchecksparams)): Configuration options for bandwidths measurements.
   - `interval` (number, optional): Time in milliseconds between each bandwidth check.
     - default: 0
   - `iterations` (number, optional): Total number of bandwidth checks to be performed.
     - default: 4
   - `save` (boolean, optional): Specifies whether to save the bandwidth results.
     - default: true
   - `from` (string, optional): The ID of the data center from which bandwidth is specifically measured.
     - default: undefined
   - `bandwidthMode` (BandwidthMode, optional): The mode of bandwidth measurement, either 'big' or 'small'.
     - default: big
     
**Example:**

```typescript
const cct = new CCT();

await cct.fetchDatacenterInformation('https://api.example.com/datacenters');

await cct.startBandwidthChecks({ from: 'datacenterId', iterations: 5, bandwidthMode: 'small' });
````

### getCurrentDatacentersSorted

Returns a list of currently managed data centers, sorted by average latency.

**Returns:**

- [Datacenter[]](#datacenter): An array of sorted data centers.

**Example:**

```typescript
const cct = new CCT();

await cct.fetchDatacenterInformation('https://api.example.com/datacenters');

const sortedDatacenters = cct.getCurrentDatacentersSorted();
```

### getAddress

Retrieves your current geographical address.

**Returns:**

- Promise<[Location](#location) | null>: A promise that resolves to the current location, or `null` if the location cannot be determined.

**Example:**

```typescript
const location = await cct.getAddress();
```

### store

Saves measurement data to a designated endpoint. The minimum threshold to initiate saving is 16 latencies.

**Parameters:**

- `location` ([Location](#location)): Location data to be included in the storage payload.
- `url` (string, optional): The endpoint URL where the data will be sent.
  - default: `https://cct.demo-education.cloud.sap/measurement`

**Returns:**

`Promise<boolean>`: True if the data was successfully stored, false otherwise.

**Example:**

```typescript
const cct = new CCT();

await cct.fetchDatacenterInformation('https://api.example.com/datacenters');

await Promise.all([cct.startLatencyChecks(), cct.startBandwidthChecks()]);

const success = await cct.store({ latitude: 34.0522, longitude: -118.2437, address: "some adress" }, "urlToSave");
```

### getClosestDatacenters

Calculates and retrieves the closest data centers to a specified geographical point.

**Parameters:**

- `latitude` (number): Latitude of the target location.
- `longitude` (number): Longitude of the target location.
- `url` (string, optional): URL to fetch data center information if not already loaded.
- `top` (number, optional): Number of top closest data centers to return.

**Returns:**

 Promise<[Datacenter](#datacenter)[]>: An array of the top closest data centers.

**Example:**

```typescript
const cct = new CCT();

await cct.fetchDatacenterInformation('https://api.example.com/datacenters');

const closestDCs = await cct.getClosestDatacenters({
  latitude: 34.0522,
  longitude: -118.2437,
  top: 5
});
```

## Events

The CCT class extends an event emitter, enabling full utilization of its capabilities.

- `latency`: This event is emitted for each latency measurement for each data center. Event data is passed to callback [LatencyEventData](#latencyeventdata)

- `latency:iteration`: This event is triggered whenever a new round of latency measurements has been completed for all data centers. It occurs sequentially; for instance, it is emitted after each data center has logged its first set of latency data, again after each has logged its second set, and so forth. Event data is passed to callback [LatencyEventData](#latencyeventdata)[]

- `latency:end`: This event is emitted when the latency measurement process has either concluded or been prematurely stopped.

- `bandwidth`: Emitted for each bandwidth measurement obtained from each data center. Event data is passed to callback [BandwidthEventData](#bandwidtheventdata)

- `bandwidth:iteration`: Emitted each time a complete round of bandwidth measurements is calculated for all data centers. This event is triggered sequentially, such as after each data center has logged its first set of bandwidth data, its second set, and so on. Event data is passed to callback [BandwidthEventData](#bandwidtheventdata)[]

- `bandwidth:end`: This event is emitted when the bandwidth measurement process has either concluded or been prematurely stopped.

## Cloud2Cloud

Local measurements involves sending a data packet from the user's machine (from a user's machine to a datacenter) and measure the time it takes to receive a response from the datacenter. This round-trip time provides an estimate of both latency and bandwidth capabilities. This is a default behavior of [startLatencyChecks](#startlatencychecks) and [startBandwidthChecks](#startbandwidthchecks).

Cloud-to-cloud measurements assess latency and bandwidth between different cloud environments (from datacenter to datacenter). Which is done using `from` parameter in [startLatencyChecks](#startlatencychecks) and [startBandwidthChecks](#startbandwidthchecks). Before starting this type of measurements fetch list of datacenters which can initiate measurements using [fetchCompatibleDCsWithSockets](#fetchcompatibledcswithsockets).

## Types

### Datacenter

```typescript
    type Datacenter = {
      id: string;
      position: number;
      cloud: string;
      name: string;
      town: string;
      country: string;
      latitude: string;
      longitude: string;
      ip: string;
      tags: string;
      lastUpdate: string;
      averageLatency: number;
      latencyJudgement?: Speed;
      averageBandwidth: BandwidthPerSecond;
      bandwidthJudgement?: Speed;
      latencies: Latency[];
      bandwidths: Bandwidth[];
      storedLatencyCount: number;
      storedBandwidthCount: number;
    };
```

### LatencyChecksParams

```typescript
  type LatencyChecksParams = {
    interval?: number;
    iterations?: number;
    save?: boolean;
    from?: string;
  }
```

### BandwidthChecksParams

```typescript
    type BandwidthChecksParams = LatencyChecksParams & {bandwidthMode?: 'big' | 'small'} 
```

### Location

```typescript
  type Location = {
      address: string;
      latitude: number;
      longitude: number;
  };
```

### LatencyEventData

```typescript
  type LatencyEventData = {
    id: string;
    data: {
      value: number;
      timestamp: number;
    };
  }
```

### IterationLatencyEventData

[`LatencyEventData`](#LatencyEventData)

### BandwidthEventData

```typescript
  type BandwidthEventData = {
    id: string;
    data: { 
      value: {
        bitsPerSecond: number;
        kiloBitsPerSecond: number;
        megaBitsPerSecond: number;
      }
    };
    timestamp: number;
  }
```

### IterationBandwidthEventData

[`BandwidthEventData[]`](#BandwidthEventData)

### FilterKeys

```typescript
    type FilterKeys = { 
        name?: string[];
        cloud?: string[];
        town?: string[];
        country?: string[];
        tags?: string[];
    };
```
