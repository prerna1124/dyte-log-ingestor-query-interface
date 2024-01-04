// KafkaConsumer.ts
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import LogService from '../service/log-service';

export class KafkaConsumer {
    private consumer: Consumer;
    private topic: string;
    private logService: LogService;

    constructor(topic: string, clientId: string, brokers: string[], groupId: string, logService: LogService) {
        const kafka = new Kafka({ clientId: clientId, brokers : brokers });
        this.consumer = kafka.consumer({ groupId });
        this.topic = topic;
        this.logService = logService;
    }

    async connect(): Promise<void> {
        await this.consumer.connect();
    }

    async subscribe(): Promise<void> {
        await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });
    }

    async consumeMessage(): Promise<void> {
        await this.consumer.run({
            eachMessage: async (payload) => {
                try {
                    console.log("Key", payload.message.key?.toString());
                    console.log("Value", payload.message.value?.toString());
                    let log;
                    if(payload.message.value !== null) {
                        log = JSON.parse(payload.message.value.toString());
                    }
                    await this.logService.createLog(log);

                    // await handler(payload);
                    // await this.consumer.commitOffsets([{ topic: this.topic, partition: payload.partition, offset: payload.message.offset + 1 }]);
                } catch (error) {
                    console.error('Error processing Kafka message:', error);
                }
            },
        });
    }

    async disconnect(): Promise<void> {
        await this.consumer.disconnect();
    }
}

export default KafkaConsumer;
