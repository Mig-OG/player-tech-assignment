const path = require('path');

const { get, set } = require('lodash');

const fs = require('../fileSystem');

module.exports = function (self = {}) {

    const configPath = path.resolve(process.env.DEV_TOOL_CONFIG || `${__dirname}/config.yml`);
    const config = {};
    
    self.load = async () => {
        Object.assign(config, (await fs.read(configPath))[0]);
        return;
    };

    self.get = (property) => {
        if (!property || property === 'all') {
            return config;
        }
        return get(config, property);
    }

    self.set = async (key, value) => {
        if (!value) {
            throw new Error('Provide value to configuration you want to set');
        }
        if(!key) {
            key = '';
        }

        set(config, key, value);
        await fs.write(configPath, config, 'utf8');
        return `${key} has been set to ${value}`;
    }

    self.help = () => {
        console.log('\nConfig module help:\n')
        console.log('get <property.name>\t=>\tGet property name, return all config when no property');
        console.log('set key value\t\t=>\tSet config value at specified key');
        console.log('\nTo use custom configuration file define the path in DEV_TOOL_CONFIG environment variable.');
    };

    return self;
}
