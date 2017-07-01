'use strict';

/**
 * Imports.
 */
const Kafka = require('node-rdkafka');

/**
 * Kafka zookeeper address.
 */
const broker = process.env.BROKER_ADDRESS || '192.168.50.200:9092';

const kafkaGlobalProducerConfig = {
    'metadata.broker.list': broker
};

function getProducerForTopic(topicName) {
    console.log(topicName + ' connecting to brokers: ' + broker);

    let stream = Kafka.Producer.createWriteStream(kafkaGlobalProducerConfig, {}, {
        topic: topicName
    });

    stream.on('error', function (err) {
        console.error('Error in our kafka stream');
        console.error(err);
    });

    return stream;
}

module.exports = {
    getProducerForTopic: getProducerForTopic
};