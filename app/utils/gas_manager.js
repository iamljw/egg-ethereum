'use strict';
const validRule = require('../rules/validator.json');
const { validate } = require('../errors/validator');

class GasTool {
    constructor(app) {
        this.gas = {
            gasLimit: '0x44364c5bb0000',
            gas: '0x13880'
        };
        this.app = app;
    }

    setGas(newGas) {
        validate(validRule.setGas, { newGas }, this.app);
        const { gas, gasLimit } = newGas;
        if (gas) {
            this.gas = '0x' + gas.toString(16);
        }
        if (gasLimit) {
            this.gasLimit = '0x' + gasLimit.toString(16);
        }
    }

    async getLastestGas() {
        let gasPrice = await this.app.web3.eth.getGasPrice();
        const randomGasBN = this.app.web3.utils.toBN(Math.round(10000 * Math.random()));
        gasPrice = this.app.web3.utils.toBN(gasPrice).add(randomGasBN).toString(16);
        return Object.assign(this.gas, { gasPrice: '0x' + gasPrice });
    }
}

module.exports = GasTool;
