import { Kafka } from 'kafkajs';
import { KafkaConsumerConfig } from '@jamestiberiuskirk/fl-shared';

class KafkaConsumer {
    config: KafkaConsumerConfig;
    conn: Kafka;

    constructor(config: KafkaConsumerConfig) {
        this.config = config;
        this.conn = new Kafka();
    }

    initConnection() {


    }
}