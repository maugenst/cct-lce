const LCE = require('../LCE');

const datacenters = [
  {
    id: '1',
    cloud: 'a',
    name: 'a1',
    town: 'A-Town',
    country: 'A-Land',
    latitude: '1.0000001',
    longitude: '1.00000001',
    ip: '1.1.1.1',
    lastUpdate: '2000-01-01T01:01:01.000Z',
  },
  {
    id: '2',
    cloud: 'b',
    name: 'b2',
    town: 'B-Town',
    country: 'B-Land',
    latitude: '2.0000002',
    longitude: '2.00000002',
    ip: '2.2.2.2',
    lastUpdate: '2000-02-02T02:02:02.000Z',
  },
  {
    id: '07fe49e2-795b-4f06-9908-436e6dc21042',
    cloud: 'gcp',
    name: 'us-west1',
    town: 'The Dalles, Oregon',
    country: 'USA',
    latitude: '45.609579600000',
    longitude: '-121.243900200000',
    ip: '35.203.140.16',
    lastUpdate: '2019-03-25T14:37:41.000Z',
  },
  {
    id: '1764db7a-7827-4c68-aba2-6031cdd11503',
    cloud: 'gcp',
    name: 'us-west2',
    town: 'Los Angeles, California',
    country: 'USA',
    latitude: '34.020346400000',
    longitude: '-118.972172000000',
    ip: '35.235.111.179',
    lastUpdate: '2019-03-12T14:19:21.000Z',
  },
  {
    id: '1991775f-1f04-46f2-987a-9979d6dfff1f',
    cloud: 'gcp',
    name: 'asia-southeast1',
    town: 'Jurong West',
    country: 'Singapore',
    latitude: '1.344059500000',
    longitude: '103.666527500000',
    ip: '35.187.235.129',
    lastUpdate: '2019-03-12T14:19:20.000Z',
  },
  {
    id: '2c59733c-5eb5-4e28-8eb5-a66f553adc1e',
    cloud: 'gcp',
    name: 'europe-west3',
    town: 'Frankfurt',
    country: 'Germany',
    latitude: '50.121127700000',
    longitude: '8.496482000000',
    ip: '35.234.85.231',
    lastUpdate: '2019-03-12T14:19:26.000Z',
  },
  {
    id: '2f7c733f-e061-4757-8929-ce7f9d5385b8',
    cloud: 'sdc',
    name: 'na',
    town: 'Philadelphia',
    country: 'US',
    latitude: '39.988021100000',
    longitude: '-75.417550500000',
    ip: '169.145.60.40',
    lastUpdate: '2019-04-02T11:49:23.000Z',
  },
  {
    id: '3147b08a-ed51-4d2f-ab7c-583594c589fa',
    cloud: 'gcp',
    name: 'us-central1',
    town: 'Council Bluffs, Iowa',
    country: 'USA',
    latitude: '41.232890300000',
    longitude: '-95.986764400000',
    ip: '23.251.147.24',
    lastUpdate: '2019-03-12T14:19:36.000Z',
  },
  {
    id: '53a97f57-754a-4f29-a663-b616d06de865',
    cloud: 'gcp',
    name: 'us-east1',
    town: 'Moncks Corner, South Carolina',
    country: 'USA',
    latitude: '33.197555000000',
    longitude: '-80.071314500000',
    ip: '34.73.200.209',
    lastUpdate: '2019-03-12T14:19:33.000Z',
  },
  {
    id: '6360fd99-fc5d-44a2-9ef1-eb917b78367a',
    cloud: 'gcp',
    name: 'europe-west1',
    town: 'St. Ghislain',
    country: 'Belgium',
    latitude: '50.489979400000',
    longitude: '3.667837600000',
    ip: '34.76.1.43',
    lastUpdate: '2019-03-12T14:18:47.000Z',
  },
  {
    id: '6baca5be-6251-4291-a946-f1fd42c9f5f0',
    cloud: 'gcp',
    name: 'northamerica-northeast1',
    town: 'Montréal',
    country: 'Canada',
    latitude: '45.557633700000',
    longitude: '-74.290718800000',
    ip: '35.203.3.227',
    lastUpdate: '2019-03-12T14:19:13.000Z',
  },
  {
    id: '8c2d6651-e705-4cb1-bd7a-e50a20103549',
    cloud: 'gcp',
    name: 'asia-east2',
    town: 'Hong Kong',
    country: 'Hongkong',
    latitude: '22.353040300000',
    longitude: '113.567243500000',
    ip: '35.220.153.230',
    lastUpdate: '2019-03-12T14:19:30.000Z',
  },
  {
    id: '8ffca54c-21e0-4f29-9eff-0ce71f3e3e37',
    cloud: 'gcp',
    name: 'us-east4',
    town: 'Ashburn, Northern Virginia',
    country: 'USA',
    latitude: '39.025552400000',
    longitude: '-77.463269400000',
    ip: '35.194.85.8',
    lastUpdate: '2019-03-12T14:19:11.000Z',
  },
  {
    id: '96f6e3fa-35b6-478a-ab38-63696b4f422a',
    cloud: 'gcp',
    name: 'asia-northeast1',
    town: 'Tokyo',
    country: 'Japan',
    latitude: '35.673576300000',
    longitude: '139.430203200000',
    ip: '34.85.35.225',
    lastUpdate: '2019-03-12T14:19:27.000Z',
  },
  {
    id: '9b22cdd1-65f9-4f3d-9f4f-3da412593568',
    cloud: 'gcp',
    name: 'asia-south1',
    town: 'Mumbai',
    country: 'India',
    latitude: '19.082522300000',
    longitude: '72.741100900000',
    ip: '35.200.173.178',
    lastUpdate: '2019-03-12T14:19:30.000Z',
  },
  {
    id: 'a50aafd6-1dd9-4fb9-9f37-c4cd13636421',
    cloud: 'gcp',
    name: 'europe-north1',
    town: 'Hamina',
    country: 'Finland',
    latitude: '60.569657200000',
    longitude: '27.139703900000',
    ip: '35.228.8.52',
    lastUpdate: '2019-03-12T14:19:39.000Z',
  },
  {
    id: 'b6fda8a6-e8d5-48e6-8223-edcd2ea20054',
    cloud: 'gcp',
    name: 'europe-west4',
    town: 'Eemshaven',
    country: 'Netherlands',
    latitude: '53.435730500000',
    longitude: '6.763058200000',
    ip: '35.204.0.225',
    lastUpdate: '2019-03-12T14:19:18.000Z',
  },
  {
    id: 'c1385980-3921-4777-8ef2-427c68c52b3e',
    cloud: 'gcp',
    name: 'asia-east1',
    town: 'Changhua County',
    country: 'Taiwan',
    latitude: '23.991873300000',
    longitude: '120.323068200000',
    ip: '34.80.3.246',
    lastUpdate: '2019-03-12T14:19:27.000Z',
  },
  {
    id: 'd0a2eb56-e8c2-457f-be23-163af3220afc',
    cloud: 'sdc',
    name: 'apj',
    town: 'Singapore',
    country: 'US',
    latitude: '1.283910000000',
    longitude: '103.811666500000',
    ip: '169.145.202.37',
    lastUpdate: '2019-04-02T11:49:25.000Z',
  },
  {
    id: 'd174e700-f28d-470c-94dd-269d7263479b',
    cloud: 'gcp',
    name: 'southamerica-east1',
    town: 'São Paulo',
    country: 'Brazil',
    latitude: '-23.680146200000',
    longitude: '-47.155743300000',
    ip: '35.198.4.46',
    lastUpdate: '2019-03-12T14:19:32.000Z',
  },
  {
    id: 'def59866-2899-4ddd-94d7-c78d8fd1f144',
    cloud: 'gcp',
    name: 'australia-southeast1',
    town: 'Sydney',
    country: 'Australia',
    latitude: '-33.845835200000',
    longitude: '150.371549900000',
    ip: '35.189.32.41',
    lastUpdate: '2019-03-12T14:19:19.000Z',
  },
  {
    id: 'e7585a2b-ed1c-4f71-9b9e-d7036d16f486',
    cloud: 'sdc',
    name: 'emea',
    town: 'Walldorf',
    country: 'Germany',
    latitude: '49.244376900000',
    longitude: '8.636224900000',
    ip: '155.56.56.14',
    lastUpdate: '2019-04-02T11:49:23.000Z',
  },
  {
    id: 'f283eadf-2165-4bdd-9c72-cce04b881c7a',
    cloud: 'gcp',
    name: 'europe-west2',
    town: 'London',
    country: 'United Kingdom',
    latitude: '51.528161300000',
    longitude: '-0.662001000000',
    ip: '35.197.201.118',
    lastUpdate: '2019-03-12T14:19:00.000Z',
  },
];

describe('lce-tests', () => {
  test('test object creation', async () => {
    let lce;
    expect(() => {
      lce = new LCE();
    }).toThrow(/Cannot destructure property/);

    expect(() => {
      lce = new LCE({
        datacenters,
      });
    }).toThrow(/Missing parameter/);

    expect(() => {
      lce = new LCE({
        datacenters,
        droneHostPrefix: 'aaa',
      });
    }).toThrow(/Missing parameter/);

    lce = new LCE({
      datacenters,
      droneHostPrefix: 'aaa',
      droneHostDomain: 'drone-domain.com',
    });

    expect(lce.droneHost.domain).toEqual('drone-domain.com');
    expect(lce.droneHost.prefix).toEqual('aaa');
    expect(lce.datacenters.length).toEqual(23);
  });

  test('test - drone latency', async () => {
    const lce = new LCE({
      datacenters,
      droneHostPrefix: 'cct-drone',
      droneHostDomain: 'mistone.de',
    });
    const ret = await lce.getLatencyFor({
      name: 'australia-southeast1',
    });
    console.log(ret);
    expect(ret.latency).toBeDefined();
    expect(ret.latency > 100).toBe(true);
  });

  test('test - drone bandwidth', async () => {
    const lce = new LCE({
      datacenters,
      droneHostPrefix: 'cct-drone',
      droneHostDomain: 'mistone.de',
    });
    const ret = await lce.getBandwidthFor({
      name: 'australia-southeast1',
    });
    console.log(ret);
    expect(ret.bandwidth).toBeDefined();
    expect(ret.bandwidth.speedBps).toBeDefined();
    expect(ret.bandwidth.speedKbps).toBeDefined();
    expect(ret.bandwidth.speedMbps).toBeDefined();
  });

  test('test - drone bandwidth by id', async () => {
    const lce = new LCE({
      datacenters,
      droneHostPrefix: 'cct-drone',
      droneHostDomain: 'mistone.de',
    });
    const ret = await lce.getBandwidthForId('9b22cdd1-65f9-4f3d-9f4f-3da412593568');
    console.log(ret);
    expect(ret.bandwidth).toBeDefined();
    expect(ret.bandwidth.speedBps).toBeDefined();
    expect(ret.bandwidth.speedKbps).toBeDefined();
    expect(ret.bandwidth.speedMbps).toBeDefined();
  });

  test('test - drone bandwidth and cancel download', async () => {
    const lce = new LCE({
      datacenters,
      droneHostPrefix: 'cct-drone',
      droneHostDomain: 'mistone.de',
    });
    lce.getBandwidthForId('9b22cdd1-65f9-4f3d-9f4f-3da412593568').then((data) => {
      console.log(data);
    }).catch((err) => {
      console.log(err);
    });
    lce.terminate();
    expect(lce.cancelableBandwidthRequests.length).toEqual(0);

    lce.getBandwidthForId('9b22cdd1-65f9-4f3d-9f4f-3da412593568').then((ret) => {
      expect(ret.bandwidth).toBeDefined();
      expect(ret.bandwidth.speedBps).toBeDefined();
      expect(ret.bandwidth.speedKbps).toBeDefined();
      expect(ret.bandwidth.speedMbps).toBeDefined();
    });
  });

  // more to come ...
});
