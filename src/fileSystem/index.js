const pathModule = require('path');

const csv = require('./csv')();
const yml = require('./yml')();

const RE = {
    CSV: /csv/i,
    YML: /[yml|yaml]/i,
};

module.exports = (function (self = {}) {
    self.read = async (path) => {
        if (!path) {
            throw new Error('Missing file path');
        }
        const type = pathModule.extname(path);
        if (RE.CSV.test(type)) {
            return csv.read(path);
        } else if (RE.YML.test(type)) {
            return yml.read(path);
        } else {
            throw new Error('Invalid file extension type')
        }
    };

    self.write = async (path, payload) => {
        if (!path) {
            throw new Error('Missing file path');
        }

        if (!payload) {
            throw new Error('Missing file content');
        }

        const type = pathModule.extname(path);

        if (RE.YML.test(type)) {
            return yml.write(path, payload);
        } else {
            throw new Error('Invalid file extension type')
        }
    };

    return self;
})();
