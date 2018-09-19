'use strict';

const Web3 = require('web3');
const GasTool = require('./app/utils/gas_manager');
const Parameter = require('parameter');

module.exports = app => {
    // web3
    app.web3 = new Web3(app.config.ethereumUtils.httpProvider);
    // gasTool
    app.GasTool = new GasTool(app);
    // Parameter
    app.validator = new Parameter();
};
