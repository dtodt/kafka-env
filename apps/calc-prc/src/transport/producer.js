'use strict';

/**
 * Imports.
 */
const Kafka = require('kafka-node'),
    Producer = Kafka.Producer,
    Client = Kafka.Client,
    KeyedMessage = Kafka.KeyedMessage;

/**
 * Kafka zookeeper address.
 */
const broker = process.env.BROKER_ADDRESS || '192.168.50.213:2181';

/**
 * Queue settings.
 */
const topic = 'calculator.to.ws',   // queue name
    partition = 0,                  // default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4
    compression = 0,                // no-compression = 0, gzip = 1, snappy = 2
    requireAcks = 1;                // acknowledge

/**
 * Zookeeper client.
 */
const client = new Client(broker);

client.once('connect', () => {
    client.loadMetadataForTopics([topic], (error, results) => {
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

    console.log('creating topic ' + topic + ' on brokers: ' + broker);
    producer.createTopics([topic], (err, data) => {
        if (err) {
            console.log('error', err);
        }
        console.log(data);
    });
});

producer.on('error', (err) => {
    console.log('error', err);
});

export const send = (result) => {
    let message = new KeyedMessage('result', result);
    let payload = [{
        topic: topic,
        partition: partition,
        messages: [message],
        attributes: compression
    }];

    producer.send(payload, (err, data) => {
        if (err) {
            console.log('error', err);
        }
        console.log(data);
    });
};