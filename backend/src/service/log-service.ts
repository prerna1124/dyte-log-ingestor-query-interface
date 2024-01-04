import { MongoClient, ObjectId } from "mongodb"
import { Log } from "../model/log"
import LogRepository from "../repository/log-repository";

class LogService {
    
    private logRepository: LogRepository
    
    constructor(client: MongoClient) {
        this.logRepository = new LogRepository(client);
    }

    async createLog(log: Log): Promise<ObjectId> {
        log.timestamp = new Date(log.timestamp);
        const logId = await this.logRepository.createLog(log);
        return logId;
    }

    async searchLogs(query: any): Promise<Log[] | null> {
        const logs = await this.logRepository.searchLogs(query);
        return logs;
    }
}

export default LogService;