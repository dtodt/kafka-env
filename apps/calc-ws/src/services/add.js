'use strict';

const transport = require('../transport');

module.exports = (args) => {
    let x = Number(args.x),
        y = Number(args.y);

    Promise.resolve(transport.send({
        operation: 'add',
        value: {
            x,
            y
        }
    })).then((result) => {
        console.log(result);
        return result;
    }, (err) => {
        console.log(`error: ${err}`)
    });
};