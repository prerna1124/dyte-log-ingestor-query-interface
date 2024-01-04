import { Request, Response } from 'express';
import { connectToMongoDB } from '../util/database';
import LogService from '../service/log-service';
import KafkaProducer from '../kafka/producer';
import KafkaConsumer from '../kafka/consumer';

const client = connectToMongoDB();
const logService = new LogService(client);

const broker = `${process.env.KAFKA_BROKER}`;
const brokers = broker.split(",");
const topic = `${process.env.KAFKA_TOPIC}`;
const clientId = `${process.env.KAFKA_CLIENT_ID}`;
const groupId = `${process.env.KAFKA_GROUP_ID}`;

const producer = new KafkaProducer(topic, clientId, brokers);
producer.connect();

export const createLog = async (req: Request, res: Response) => {
    // let logId = await logService.createLog(req.body);
    if(req.body) {
        await producer.produceMessage(req.body);
        res.status(200).json({ message: 'Log is published.' });
    } else {
        res.status(400).json({ message: "Bad Request." });
    }
};

export const searchLogs = async (req: Request, res: Response) => {
    try {

        const query: any = {};
    
        const { level, fromdate, todate, message, resourceid, timestamp, traceid, spanid, commit, parentresourceid } = req.headers;
    
        if (level) query.level = level;
        if (message) query.message = message;
        if (resourceid) query.resourceId = resourceid;
        if (timestamp) query.timestamp = new Date(timestamp as string);
        if (traceid) query.traceId = traceid;
        if (spanid) query.spanId = spanid;
        if (commit) query.commit = commit;
        if (parentresourceid) query['metadata.parentResourceId'] = parentresourceid;

        if (fromdate && todate) {
            query.timestamp = {
                $gte: new Date(fromdate as string),
                $lte: new Date(todate as string),
            };
        } else if (fromdate) {
            query.timestamp = { $gte: new Date(fromdate as string) };
        } else if (todate) {
            query.timestamp = { $lte: new Date(todate as string) };
        }    

        const logs = await logService.searchLogs(query);

        res.status(200).json(logs);
    } catch (error) {
        console.error('Error during log search:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const healthCheck = async (req: Request, res: Response) => {
    try {
        res.status(201).json({"status" : "Service Running"});
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const consumer = new KafkaConsumer(topic, clientId, brokers, groupId, logService);
consumer.connect();
consumer.subscribe();

// Start consuming messages
consumer.consumeMessage();

// Handle shutdown gracefully
process.on('SIGTERM', async () => {
    await producer.disconnect();
    await consumer.disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    await producer.disconnect();
    await consumer.disconnect();
    process.exit(0);
});