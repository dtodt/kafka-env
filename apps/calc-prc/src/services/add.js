'use strict';

const operations = require('./operations'),
    producer = require('../transport/producer').getProducerForTopic('calculator.from.add'),
    consumer = require('../transport/consumer');

consumer.subscribeToTopic('calculator.to.add', (data) => {
    console.log('calculator.to.add: ' + data.toString());

    let dataParsed = JSON.parse(data.toString());
    let calc = operations.sum(dataParsed.x, dataParsed.y);
    console.log('calculator.to.add.calc: ' + calc.toString());

    producer.write(new Buffer(calc.toString()));
});