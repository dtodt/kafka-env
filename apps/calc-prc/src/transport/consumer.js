'use strict';

/**
 * Imports.
 */
const Kafka = require('node-rdkafka');

/**
 * Kafka zookeeper address.
 */
const broker = process.env.BROKER_ADDRESS || '192.168.50.100:9092';

const kafkaGlobalConsumerConfig = {
    'metadata.broker.list': broker,
    'group.id': 'toAdd',
    'socket.keepalive.enable': true,
    'enable.auto.commit': true,
    'auto.commit.interval.ms': 1
};

function subscribeToTopic(topics, cb) {
    console.log(topics + ' connecting to brokers: ' + broker);

    let stream = Kafka.KafkaConsumer.createReadStream(kafkaGlobalConsumerConfig, {}, {
        topics: topics,
        waitInterval: 0,
        objectMode: false
    });

    stream.on('data', function (data) {
        cb(data);
    });

    stream.on('error', function (err) {
        console.log(err);
    });

    stream.consumer.on('event.error', function (err) {
        console.log(err);
    });
}

module.exports = {
    subscribeToTopic: subscribeToTopic
};