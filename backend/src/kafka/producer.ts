import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import * as dotenv from 'dotenv';
import { Log } from '../model/log';
import {v4 as uuidv4} from 'uuid';

dotenv.config();

class KafkaProducer {
    private producer: Producer;
    private topic: string;

    constructor(topic: string, clientId: string, brokers: string[]) {
        this.topic = topic;
        const kafka = new Kafka({ clientId: clientId, brokers: brokers });
        this.producer = kafka.producer();
    }
  
    async connect(): Promise<void> {
        await this.producer.connect();
    }
  
    async produceMessage(log: Log): Promise<void> {
        log.logId = uuidv4();
        await this.producer.send({
            topic: this.topic,
            messages: [{ key: log.logId, value: JSON.stringify(log) }],
        });
    }
  
    async disconnect(): Promise<void> {
        await this.producer.disconnect();
    }
}

export default KafkaProducer;