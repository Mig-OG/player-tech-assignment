const updateInit = require('./update');

module.exports = function (appConfig, self = {}) {

    const { update } = updateInit(appConfig);
    self.update = update;

    self.help = () => {
        console.log('\nPlayer module help:\n');
        console.log('update path/to/input/csv\t=>\tUpdate player API with csv information. Field player will update accordingly');
        console.log('\t\t\t\t=>\tFor more information about csv format, please refer to the README.md')
    };

    return self;
};
