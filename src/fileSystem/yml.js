const fs = require('fs');
const { promisify } = require('util');

const yml = require('js-yaml');

const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);

module.exports = function (self = {}) {

    self.read = async (path) => {
        return yml.safeLoadAll((await read(path, 'utf8')));
    }

    self.write = (path, payload) => {
        const p = JSON.parse(JSON.stringify(payload))
        return write(path, yml.safeDump(p), 'utf8');
    } 

    return self;
};
