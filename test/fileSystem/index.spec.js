const chai = require('chai');

const fs = require('../../src/fileSystem');

const should = chai.should();

describe('# fileSystem module unit test', function () {
    const CSV_HEADERS = [
        'mac_addresses',
        'music_app',
        'diagnostic_app',
        'settings_app',
    ];
    const CSV_EXPECTED_PAYLOAD = [
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
    ];
    const YML_EXPECTED_CONFIG = {
        clientId: '12345abc',
        clientSecret: 'superSecret123',
        key: {
            property1: 'property1',
            property2: {
                nestedProperty: [1, 2, 3, 4],
            },
        },
    };
    
    describe('# writing Operations', function () {
        it('should throw if path is not set', async function () {
            try {
                await fs.write();
            } catch (err) {
                err.message.should.equal('Missing file path');
            }
        });

        it('should throw if payload is not set', async function () {
            try {
                await fs.write('path.yml');
            } catch (err) {
                err.message.should.equal('Missing file content');
            }
        });

        it('should throw if file extention is not yml', async function () {
            try {
                await fs.write(`${__dirname}/../config`, YML_EXPECTED_CONFIG);
            } catch (err) {
                err.message.should.equal('Invalid file extension type');
            }
        });

        it('should allowed to write yml file', async function () {
            try {
                await fs.write(`${__dirname}/../config.yml`, YML_EXPECTED_CONFIG);
            } catch (err) {
                should.fail()
            }
        });

        it('should not allowed to write unhandle file extention like csv', async function () {
            try {
                await fs.write(`${__dirname}/../config.csv`, YML_EXPECTED_CONFIG);
            } catch (err) {
                err.message.should.equal('Invalid file extension type');
            }
        });
    });

    describe('# Reading Operations', function () {
        it('should throw if path is not set', async function () {
            try {
                await fs.read();
            } catch (err) {
                err.message.should.equal('Missing file path');
            }
        });

        it('should throw if file extention is not yml or csv', async function () {
            try {
                await fs.read(`${__dirname}/../config`);
            } catch (err) {
                err.message.should.equal('Invalid file extension type');
            }
        });

        it('should allowed to read yml file', async function () {
            try {
                const [ yml ] = await fs.read(`${__dirname}/../config.yml`);
                yml.should.deep.equal(YML_EXPECTED_CONFIG);
            } catch (err) {
                should.fail()
            }
        });

        it('should allowed to read csv file', async function () {
            try {
                const csv = await fs.read(`${__dirname}/../input.csv`);
                csv.headers.should.deep.equal(CSV_HEADERS);
                csv.payload.should.deep.equal(CSV_EXPECTED_PAYLOAD);
            } catch (err) {
                should.fail()
            }
        });
    });
});
