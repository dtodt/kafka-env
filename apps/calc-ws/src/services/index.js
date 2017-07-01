'use strict';

const addProducer = require('../transport/producer').getProducerForTopic('calculator.to.add'),
    subProducer = require('../transport/producer').getProducerForTopic('calculator.to.sub'),
    addConsumer = require('../transport/consumer'),
    subConsumer = require('../transport/consumer');

const add = (args, callback) => {
    let operation = {
        x: Number(args.x),
        y: Number(args.y)
    };

    addProducer.write(new Buffer(JSON.stringify(operation)));

    addConsumer.subscribeToTopic('calculator.from.add', (data) => {
        console.log('calculator.from.add: ' + data.toString());

        callback(data.toString());
    });
};

const sub = (args, callback) => {
    let operation = {
        x: Number(args.x),
        y: Number(args.y)
    };

    subProducer.write(new Buffer(JSON.stringify(operation)));

    subConsumer.subscribeToTopic('calculator.from.sub', (data) => {
        console.log('calculator.from.sub: ' + data.toString());

        callback(data.toString());
    });
};

const services = {
    calculator: {
        calculatorService: {
            add: add,
            sub: sub
        }
    }
};

module.exports = services;