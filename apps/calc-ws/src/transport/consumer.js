'use strict';

/**
 * Imports.
 */
const Kafka = require('kafka-node'),
    Consumer = Kafka.Consumer,
    Client = Kafka.Client;

/**
 * Kafka zookeeper address.
 */
const broker = process.env.BROKER_ADDRESS || '192.168.50.213:2181';

/**
 * Zookeeper client.
 */
const client = new Client(broker);

/**
 * Queue settings.
 */
const topic = 'calculator.from.prc',    // queue name
    partition = 0,                      // default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4
    fetchRequest = [{                   // array of topics to consume
        topic: topic,
        partition: partition
    }],
    fetchOptions = {                    // consumer options
        groupId: 'calculator.server',
        autoCommit: false
    };

/**
 * Queue consumer.
 */
const consumer = new Consumer(client, fetchRequest, fetchOptions);

consumer.on('message', message => {
    console.log("message", message);
});

consumer.on('error', error => {
    console.log("error", error);
});

consumer.on('offsetOutOfRange', offsetOutOfRange => {
    console.log("offsetOutOfRange", offsetOutOfRange);
});