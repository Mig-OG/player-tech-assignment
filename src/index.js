const cli = require('./cli');
const cliInit = require('./cli');
const configuration = require('./configuration');
const playerInit = require('./player');

async function init () {
    const config = configuration();
    await config.load();

    const player = playerInit(config);

    const modules = {
        config,
        player,
    }

    return cliInit(modules);
}
async function main () {
    const cli = await init();
    await cli.exec();
}

module.exports = main;
