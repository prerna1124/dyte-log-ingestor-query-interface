import * as dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config();

if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI in environment variables');
    process.exit(1);
}

const url = `${process.env.MONGODB_URI}`;

const client = new MongoClient(url, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

let isConnected = false;
export function connectToMongoDB(): MongoClient {
    try {
        if (!isConnected) {
            client.connect();
            isConnected = true;
            console.log('Connected to MongoDB');
        }
        return client;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

// process.on('SIGINT', async () => {
//     try {
//         await client.close();
//         console.log('MongoDB connection closed');
//         process.exit(0);
//     } catch (error) {
//         console.error('Error closing MongoDB connection:', error);
//         process.exit(1);
//     }
// });