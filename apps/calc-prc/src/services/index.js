'use strict';

const operations = require('./operations');

const calculate = (message) => {
    let result;

    switch (message.operation) {
        case 'add':
            result = operations.sum(message.value.x, message.value.y);
            break;
        case 'sub':
            result = operations.subtract(message.value.x, message.value.y);
            break;
        case 'div':
            result = operations.divide(message.value.x, message.value.y);
            break;
        case 'mult':
            result = operations.multiply(message.value.x, message.value.y);
            break;
        default:
            result = 0;
    }

    return JSON.stringify({
        result: result
    });
};

module.exports = {
    calculate
};