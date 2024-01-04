import bcrypt from "bcryptjs";
import * as dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import UserRepository from "../repository/user-repository";
import User, { IUser } from "../model/user";
import { MongoClient } from "mongodb";

dotenv.config();
class UserService {
    private userRepository;

    constructor(client: MongoClient) {
        this.userRepository = new UserRepository(client);
    }

    async addUser(user: IUser): Promise<{error:unknown} | {token:string}> {
        const result = await this.userRepository.getUserByEmail(user.email);
        if(!result) {
            try {
                console.log("I am here");
                const hashPassword = await bcrypt.hash(user.password, 10);
                user.password = hashPassword
                user.role = 'user';
                const addedUser = await this.userRepository.addUser(user); 
                if(addedUser === undefined || addedUser === null) {
                    return { error: 'Failed! Please Try Again.' };
                }
                const email = user.email;
                const payload = {email};
                const secretKey: string | undefined = process.env.ACCESS_TOKEN_SECRET;
                if(secretKey !== undefined) {
                    const token = jwt.sign(payload, secretKey, {
                        expiresIn: '1h', // Set the expiration time as needed
                    });
                    return {token : token};
                } else {
                    return { error: 'Failed! Please Try Again.' };
                }
            } catch (err) {
                return {error: err};
            }       
        } else {
            return { error: 'User already exists' }; // Return an error message if the user already exists
        }
    }

    async loginUser(email:string, password:string) : Promise<{error:unknown} | {token:string}>{
        const result = await this.userRepository.getUserByEmail(email);
        if(result) {
            const isSame = await bcrypt.compare(password, result.password);
            if(isSame) {
                const payload = {email};
                const secretKey: string | undefined = process.env.ACCESS_TOKEN_SECRET;
                if(secretKey !== undefined) {
                    const token = jwt.sign(payload, secretKey, {
                        expiresIn: '1h', // Set the expiration time as needed
                    });
                    return {token : token};
                } else {
                    return { error: 'Login Unsuccessful' };
                }
            } else {
                return { error: 'Wrong Password, Login Unsuccessful' };
            }
        } else {
            return { error: 'User does not exist!' };
        }
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        const result = await this.userRepository.getUserByEmail(email);
        return result;
    }
}

export default UserService;