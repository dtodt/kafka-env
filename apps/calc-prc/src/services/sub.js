'use strict';

const operations = require('./operations'),
    producer = require('../transport/producer').getProducerForTopic('calculator.from.sub'),
    consumer = require('../transport/consumer');

consumer.subscribeToTopic('calculator.to.sub', (data) => {
    console.log('calculator.to.sub: ' + data.toString());

    let dataParsed = JSON.parse(data.toString());
    let calc = operations.subtract(dataParsed.x, dataParsed.y);
    console.log('calculator.to.sub.calc: ' + calc.toString());

    producer.write(new Buffer(calc.toString()));
});