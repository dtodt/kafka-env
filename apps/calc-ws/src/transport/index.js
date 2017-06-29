'use strict';

/**
 * Imports.
 */
const Kafka = require('kafka-node'),
    Producer = Kafka.Producer,
    Client = Kafka.Client,
    Consumer = Kafka.Consumer;

/**
 * Kafka zookeeper address.
 */
const broker = process.env.BROKER_ADDRESS || '192.168.50.200:2181';

/**
 * Zookeeper client.
 */
const client = new Client(broker);

/**
 * Queue settings.
 */
const fromWs = 'calculator.from.ws', // to calculate queue name
    toWs = 'calculator.to.ws',       // calculated queue name
    partition = 0,                   // default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4
    compression = 0,                 // no-compression = 0, gzip = 1, snappy = 2
    requireAcks = 1,                 // acknowledge
    fetchRequest = [{                // array of topics to consume
        topic: toWs,
        partition: partition
    }],
    fetchOptions = {                 // consumer options
        groupId: 'calculator.server'
    };

client.once('connect', () => {
    client.loadMetadataForTopics([fromWs, toWs], (error, results) => {
        if (error) {
            return console.error(error);
        }
        console.log(results[1].metadata);
    });
});

/**
 * Queue producer.
 */
const producer = new Producer(client, {requireAcks: requireAcks});

producer.on('ready', () => {
    console.log('ready');

    console.log('creating topics ' + [fromWs, toWs] + ' on brokers: ' + broker);
    producer.createTopics([fromWs, toWs], (err, data) => {
        if (err) {
            console.log('error', err);
        }
        console.log(data);
    });
});

producer.on('error', (err) => {
    console.log('error', err);
});

const send = (toCalc) => {
    let payload = [{
        topic: fromWs,
        partition: partition,
        messages: JSON.stringify(toCalc),
        attributes: compression
    }];

    producer.send(payload, (err, data) => {
        if (err) {
            console.log('error', err);
        }
        console.log(data);
    });

    return new Promise((resolve, reject) => {
        const consumer = new Consumer(client, fetchRequest, fetchOptions);
        consumer.on('message', message => {
            console.log(message);
            console.log(message.value);
            let result = JSON.parse(message.value).result;
            resolve(Number(result));
        });
    });
};

module.exports = {
    send
};