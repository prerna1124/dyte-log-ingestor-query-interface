import { Collection, ObjectId, Db, InsertOneResult, MongoClient } from 'mongodb';
import { IUser } from '../model/user';

class UserRepository {
    private userCollection: Collection<IUser>; // Define your MongoDB collection type
    private client: MongoClient;
    private db: Db;
    
    constructor(client : MongoClient) {
        this.client = client;
        this.db = this.client.db(process.env.MONGO_DB_NAME);
        this.userCollection = this.db.collection<IUser>('users');
    }

    async addUser(user : IUser) : Promise<ObjectId> {   
        console.log("User in Repository", user); 
        const result: InsertOneResult<IUser> = await this.userCollection.insertOne(user);
        console.log("Result", result);
        return result.insertedId;
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        const user: IUser | null = await this.userCollection.findOne({ email: email});
        return user;
    }
}

export default UserRepository;
