const chai = require('chai');

const playerInit = require('../../src/player');
const updateInit = require('../../src/player/update');

const should = chai.should();

describe('# Player Module', function () {
    const mockConfig = {
        get: (property) => {
            if (property === 'clientId') {
                return '12345abc';
            }
            if (property === 'clientSecret') {
                return 'superSecret123';
            }
        }
    }

    const player = playerInit(mockConfig);

    beforeEach(() => {
        player.update = updateInit(mockConfig)
    });

    describe('Update submodule', function () {
        const CSV_HEADERS = [
            'mac_addresses',
            'music_app',
            'diagnostic_app',
            'settings_app',
        ];
        const CSV_PAYLOAD = [
            {
                mac_addresses: 'a1:bb:cc:dd:ee:ff',
                music_app: 'v1.4.10',
                diagnostic_app: 'v1.2.6',
                settings_app: 'v1.1.5',
            },
            {
                mac_addresses: 'b2:bb:cc:ee:dd:00',
                music_app: 'v1.4.9',
                diagnostic_app: 'v1.2.0',
                settings_app: 'v1.1.9',
            },
        ]
        const fromCsvReader = {
            headers: CSV_HEADERS,
            payload: CSV_PAYLOAD
        }
        const expectedResult = [
            {
                mac: 'a1:bb:cc:dd:ee:ff',
                body: {
                    profile: {
                        applications: [{
                            applicationId: 'music_app',
                            version: 'v1.4.10',
                        },{
                            applicationId: 'diagnostic_app',
                            version: 'v1.2.6',
                        },{
                            applicationId: 'settings_app',
                            version: 'v1.1.5',
                        }]
                    },
                },
            },
            {
                mac: 'b2:bb:cc:ee:dd:00',
                body: {
                    profile: {
                        applications: [{
                            applicationId: 'music_app',
                            version: 'v1.4.9',
                        },{
                            applicationId: 'diagnostic_app',
                            version: 'v1.2.0',
                        },{
                            applicationId: 'settings_app',
                            version: 'v1.1.9',
                        }]
                    },
                },
            },
        ];
        it('should format test/input.csv as the expectedResult', function () {
            const res = player.update.transform(fromCsvReader)
            res.should.deep.equal(expectedResult);
        });
        it('should discard entries with invalid MAC addresses', function () {
            const erronousEntry = {
                mac_addresses: 'a1:bb:cc',
                music_app: 'v1.4.10',
                diagnostic_app: 'v1.2.6',
                settings_app: 'v1.1.5',
            }
            fromCsvReader.payload.push(erronousEntry);
            const res = player.update.transform(fromCsvReader)
            res.should.deep.equal(expectedResult);
            res.includes(erronousEntry).should.be.false;
        });
        it('should return true on valid mac address', function() {
            const mac = 'a1:bb:cc:dd:ee:ff';
            player.update.isValidMacAddress(mac).should.be.true;
        });

        it('should return false on invalid mac address', function() {
            const mac = 'a1:bb:cc:dd:ee:fg';
            player.update.isValidMacAddress(mac).should.be.false;
        });

        it('should respond with 401 when invalid clientId', async function () {
            mockConfig.get = (property) => {
                if (property === 'clientId') {
                    return 'invalidClient';
                }
                if (property === 'clientSecret') {
                    return 'superSecret123';
                }
            };
            const updateSubmodule = updateInit(mockConfig);
            try {
                await updateSubmodule.updatePlayersApiRequest(expectedResult);
                should.fail();
            } catch (err) {
                err.should.exist;
                err.statusCode.should.equal(401);
            }
        });
    });
});
