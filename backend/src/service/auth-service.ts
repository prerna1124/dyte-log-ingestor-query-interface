import { NextFunction, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import UserService from './user-service';
import { connectToMongoDB } from '../util/database';

dotenv.config();

const client = connectToMongoDB();
const userService = new UserService(client);

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token; 
    if (!token) {
        return res.sendStatus(401); 
    }
    try {
        const secretKey: string | undefined = process.env.ACCESS_TOKEN_SECRET;
        if(secretKey !== undefined) {
            const user: any = await new Promise((resolve, reject) => {
                jwt.verify(token, secretKey, (err: any, user: any) => {
                    if (err) {
                        reject(err); 
                    } else {
                        resolve(user);
                    }
                });

            });
            const result = await userService.getUserByEmail(user.email);
            if(!result) {
                res.status(401).json({ error: 'Unauthorized Access' });
            } else {
                const isAdmin = await checkifAdmin((result as any).role);
                if (isAdmin) {
                    next();
                } else {
                    res.status(401).json({ message: 'Unauthorized Access' });
                }
            }
        } 
    }
    catch(err) {
        res.status(401).json({ error: 'You are not logged in.' });
    }
}

export default authenticate;

async function checkifAdmin(role: string) : Promise<boolean> {
    if(role === "admin") {
        return true;
    } else {
        return false;
    }
}
