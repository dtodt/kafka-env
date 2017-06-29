'use strict';

const services = {
    calculator: {
        calculatorService: {
            add: require('./add'),
            sub: require('./sub')
        }
    }
};

module.exports = services;