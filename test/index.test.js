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
    expect(lce.datacenters.length).toEqual(2);
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

  // more to come ...
});
