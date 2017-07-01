'use strict';

const producer = require('../transport/producer').getProducerForTopic('calculator.to.add'),
    consumer = require('../transport/consumer');

module.exports = (args, callback) => {
    let x = Number(args.x),
        y = Number(args.y);

    let operation = {
        x,
        y
    };

    producer.write(new Buffer(JSON.stringify(operation)));

    consumer.subscribeToTopic('calculator.from.add', (data) => {
        console.log('calculator.from.add: ' + data.toString());

        callback(data.toString());
    });
};