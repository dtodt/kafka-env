'use strict';

const producer = require('../transport/producer').getProducerForTopic('calculator.to.sub'),
    consumer = require('../transport/consumer');

module.exports = (args, callback) => {
    let x = Number(args.x),
        y = Number(args.y);

    let operation = {
        x,
        y
    };

    producer.write(new Buffer(JSON.stringify(operation)));

    consumer.subscribeToTopic('calculator.from.sub', (data) => {
        console.log('calculator.from.sub: ' + data.toString());

        callback(data.toString());
    });
};