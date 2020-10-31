const fs = require('../fileSystem');

const { fetch } = require('../../mock')();

const macHeader = 'mac_addresses';
const RE_MAC_ADDRESS = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

module.exports = function (appConfig, self = {}) {
    const config = appConfig;

    self.isValidMacAddress = (mac) => {
        return RE_MAC_ADDRESS.test(mac);
    };

    self.transform = (data) => {
        const applicationIds = data.headers.filter((header) => header !== macHeader);
        const payload = data.payload;
        
        return payload.map((row) => {
            if (!self.isValidMacAddress(row[macHeader])){
                console.log(`${row[macHeader]} is an invavalid MAC address and will be discarded`);
                return;
            }
            
            const applications = [];
            applicationIds.forEach((app) => {
                applications.push({
                    applicationId: app,
                    version: row[app],
                });
            });

            return {
                mac: row[macHeader],
                body: {
                    profile: {
                        applications,
                    }
                }
            };
        })
        .filter((validPayload) => validPayload);
    }

    authenticateApiRequest = async (clientId, secret) => {
        const headers =  {
            'Content-Type': 'application/json',
            'x-client-id': clientId,
            'x-client-secret': secret,
        }

        return (await fetch({
            url: 'http://localhost/genToken',
            method: 'GET',
            headers,
        })).body;
    }

    self.updatePlayersApiRequest = async (toUpdate) => {
        try {
            console.log('Getting API token...')
            const token = await authenticateApiRequest(
                config.get('clientId'),
                config.get('clientSecret'),
            );

            const headers =  {
                'Content-Type': 'application/json',
                'x-client-id': config.get('clientId'),
                'x-authentication-token': token,
            }
            console.log('Sending Payload for update...');
            return Promise.allSettled(toUpdate.map((device) => fetch({
                url: `http://localhost/profiles/${config.get('clientId')}:${device.mac}`,
                method: 'PUT',
                headers,
                body: device.body,
            })));
        } catch (err) {
            throw err;
        }
    };  

    self.update = async (inputPath) => {
        try {
            const toUpdate = self.transform((await fs.read(inputPath)));
            const results = await self.updatePlayersApiRequest(toUpdate);
            return cliResponse(results, toUpdate);
        } catch (err) {
            return cliDisplayError(err);
        }
    }

    const cliResponse = (response, toUpdate) => {
        if (response.some((r) => r.status === 'rejected')) {
            const returnValue = response.map((r, i) => {
                if (r.status === 'rejected') {
                    const { reason } = r;
                    return (`MAC: ${toUpdate[i].mac}, ` + cliDisplayError(reason));
                }
            });
            returnValue.unshift('These MAC hasn\'t been updated:');
            return returnValue;
        } else {
            return 'The content of the CSV has been properly uploaded to player update API.';
        }
    }
    const cliDisplayError = (err) => {
        return `http statusCode: ${err.statusCode}, error: ${err.error}, message: ${err.message}`;
    }

    return self;
}
