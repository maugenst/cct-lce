const LCE = require('../index');

const datacenters = [
        {
            "id": "1",
            "cloud": "a",
            "name": "a1",
            "town": "A-Town",
            "country": "A-Land",
            "latitude": "1.0000001",
            "longitude": "1.00000001",
            "ip": "1.1.1.1",
            "lastUpdate": "2000-01-01T01:01:01.000Z"
        },
        {
            "id": "2",
            "cloud": "b",
            "name": "b2",
            "town": "B-Town",
            "country": "B-Land",
            "latitude": "2.0000002",
            "longitude": "2.00000002",
            "ip": "2.2.2.2",
            "lastUpdate": "2000-02-02T02:02:02.000Z"
        }
    ];

describe('lce-tests', () => {
    test('test object creation', async () => {

        expect(() => {
            const lce = new LCE();
        }).toThrow(/Cannot destructure property/);

        expect(() => {
            const lce = new LCE({
                datacenters
            });
        }).toThrow(/Missing parameter/);

        expect(() => {
            const lce = new LCE({
                datacenters,
                droneHostPrefix: 'aaa'
            });
        }).toThrow(/Missing parameter/);

        const lce = new LCE({
            datacenters,
            droneHostPrefix: 'aaa',
            droneHostDomain: 'drone-domain.com'
        });

        expect(lce.droneHost.domain).toEqual('drone-domain.com');
        expect(lce.droneHost.prefix).toEqual('aaa');
        expect(lce.datacenters.length).toEqual(2);
    });

    // more to come ...
});