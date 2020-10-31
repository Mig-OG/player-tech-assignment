module.exports = function (modulesList, self = {}) {
    const modules = modulesList;
    
    self.parseCliInput = (cliArgs) => {
        const argv = cliArgs.slice(2);
        const mod = argv.shift();
        const func = argv.shift()

        return { argv, mod, func };
    }

    self.exec = async () => {
        const { argv, mod, func } = self.parseCliInput(process.argv);

        if (!mod || !func) {
            return self.help(mod);
        }

        try {
            const res = await modules[mod][func](...argv);

            if(typeof res === 'string') {
                console.log(res);
            } else if (Array.isArray(res)) {
                res.forEach(console.log);
            }
        } catch (err) {
            return self.help();
        }
    };

    self.help = (called) => {
        if(called) {
            return modules[called].help();
        }
        console.log('\nHere is the list of available modules:\n');
        console.log('config\t=>\tModule use to get and set configurations properties');
        console.log('player\t=>\tModule use to interact with the player API\n');
    };

    return self;
}
