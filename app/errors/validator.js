'use strict';

const { ParameterError } = require('./parameter_error');

exports.validate = (rule, data, app) => {
    if (!app.config.ethereum.validate) {
        return;
    }
    const errors = app.validator.validate(rule, data);
    if (errors) {
        throw new ParameterError(JSON.stringify(errors));
    }
};
