import { Log } from "../model/log";
import { Collection, Db, InsertOneResult, MongoClient, ObjectId } from "mongodb";

class LogRepository {

    private logCollection: Collection<Log>;
    private db: Db;

    constructor(client: MongoClient) {
        this.db = client.db(process.env.MONGO_DB_NAME)
        this.logCollection = this.db.collection<Log>('logs');
    }

    async createLog(log: Log): Promise<ObjectId> {
        const result: InsertOneResult<Log> = await this.logCollection.insertOne(log);
        return result.insertedId;
    }

    async searchLogs(query: any): Promise<Log[] | null> {
        const result: Log[] = await this.logCollection.find(query).toArray();
        return result;
    }
}

export default LogRepository;