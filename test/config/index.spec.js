const chai = require('chai');

const configInit = require('../../src/configuration');

const should = chai.should();

process.env.DEV_TOOL_CONFIG = `${__dirname}/../config.yml`
const expectedConfig = {
    clientId: '12345abc',
    clientSecret: 'superSecret123',
    key: {
        property1: 'property1',
        property2: {
            nestedProperty: [1, 2, 3, 4],
        },
    },
};
describe('# Configuration Module', function () {
    const config = configInit();
    try {
        (async () => await config.load())();
    } catch (err) {
        should.fail();
    }

    describe('# writes', function () {
        it('should be possible to add new config property at root', async function () {
            const value = expectedConfig.key;
            try {
                await config.set('key', value);
            } catch (err) {
                should.fail();
            }
        });
        it('should be possible to change config property at any nested level', async function () {
            const value = expectedConfig.key.property2.nestedProperty;
            try {
                await config.set('key.property2.nestedProperty', value);
            } catch (err) {
                should.fail();
            }
        });
    });

    describe('# reads', function () {
        it('should return complete config object when config.get() has no parameter', function () {
            config.get().should.deep.equal(expectedConfig);
        });
        it('should return requested config field when passed in config.get()', function () {
            config.get('key.property2.nestedProperty')
                .should.deep.equal(expectedConfig.key.property2.nestedProperty);
        });
    });
});
