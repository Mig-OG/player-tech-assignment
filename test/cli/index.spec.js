const chai = require('chai');
const sinon = require('sinon');

const cliInit = require('../../src/cli');

const should = chai.should();
const expect = chai.expect;

describe('# CLI module unit test', function () {
    const sandbox = sinon.createSandbox();
    const modules = {};
    const cli = cliInit(modules);

    beforeEach(function () {
        modules.config = {
            get: sandbox.spy(),
            set: sandbox.spy(),
            help: sandbox.spy(),
        };
        modules.player = {
            update: sandbox.spy(),
            help: sandbox.spy(),
        }
        cli.help = sandbox.spy();
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('parseCliInput function', function () {
        const cliArgs = [
            'node',
            'path/to/file.js',
        ];
        it('expect argv to be empty, mod and func undefined when 2 arguments come from CLI', function () {
            const { argv, mod, func } = cli.parseCliInput(cliArgs);
            expect(argv).to.be.empty;
            expect(mod).to.be.undefined;
            expect(func).be.undefined;
        });
        it('expect argv to be empty and func undefined when 3 arguments come from CLI', function () {
            cliArgs.push('config');
            const { argv, mod, func } = cli.parseCliInput(cliArgs);
            expect(argv).to.be.empty;
            expect(mod).to.equal('config');
            expect(func).be.undefined;
        });
        it('expect argv to be empty when 4 arguments come from CLI', function () {
            cliArgs.push('get');
            const { argv, mod, func } = cli.parseCliInput(cliArgs);
            expect(argv).to.be.empty;
            expect(mod).to.equal('config');
            expect(func).to.equal('get');
        });
        it('expect argv.length to equal cliArgs.length - 4', function () {
            cliArgs.push('clientId');
            let { argv } = cli.parseCliInput(cliArgs);
            expect(argv.length).to.equal(cliArgs.length - 4);
        });
    });

    describe('cli.exec function', function () {

        it('should throw when no module', async function () {
            const argv = [];
            const mod = undefined;
            const func = undefined;
            cli.parseCliInput = () => {
                return { argv, mod, func };
            };

            try {
                await cli.exec();
            } catch (err) {
                cli.help.called.should.be.true;
                err.message.should.equal('Missing module name')
            }
        });
        it('should throw when module, but no func', async function () {
            const argv = [];
            const mod = 'config';
            const func = undefined;
            cli.parseCliInput = () => {
                return { argv, mod, func };
            };

            try {
                await cli.exec();
            } catch (err) {
                cli.help.called.should.be.true;
                //modules.config.help.called.should.be.true;
                err.message.should.equal('Missing module function name')
            }
        });
    });
});
