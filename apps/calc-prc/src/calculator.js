'use strict';

/**
 * Imports.
 */
const Kafka = require('kafka-node'),
    Producer = Kafka.Producer,
    Consumer = Kafka.Consumer,
    Client = Kafka.Client,
    services = require('./services');

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
const fromWs = 'calculator.from.ws',    // to calculate queue name
    toWs = 'calculator.to.ws',          // calculated queue name
    partition = 0,                      // default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4
    compression = 0,                    // no-compression = 0, gzip = 1, snappy = 2
    requireAcks = 1,                    // acknowledge
    fetchRequest = [{                   // array of topics to consume
        topic: fromWs,
        partition: partition
    }],
    fetchOptions = {                    // consumer options
        groupId: 'calculator.processor',
        autoCommit: false
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

/**
 * Queue consumer.
 */
const consumer = new Consumer(client, fetchRequest, fetchOptions);

consumer.on('message', message => {
    console.log("message", message);

    let payload = [{
        topic: toWs,
        partition: partition,
        messages: services.calculate(JSON.parse(message.value)),
        attributes: compression
    }];

    producer.send(payload, (err, data) => {
        if (err) {
            console.log('error', err);
        }
        console.log(data);
    });
});

consumer.on('error', error => {
    console.log("error", error);
});

consumer.on('offsetOutOfRange', offsetOutOfRange => {
    console.log("offsetOutOfRange", offsetOutOfRange);
});

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
