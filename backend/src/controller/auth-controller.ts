import { Request, Response } from 'express';
import { connectToMongoDB } from '../util/database';
import { IUser } from '../model/user';
import UserService from '../service/user-service';

const client = connectToMongoDB();
const userService = new UserService(client);

export const signUp = async (req: Request, res: Response) => {
    const user: IUser = req.body;
    if(!user.email || !user.name || !user.password || !user.phone) {
        res.status(400).json({ message: "Sign Up Failed", error: "Fill all mandatory fields" });
    } else {
        let result = await userService.addUser(user);
        if('error' in result) {
            res.status(400).json({ message: "Sign Up Failed", error: result['error'] });
        } else if('token' in result) {
            res.cookie('token', result['token']);
            res.status(200).json({ message: "Signed Up Successfully" });
        }
    }
};

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    if(!email || !password) {
        res.status(400).json({ message: "Login Failed", error: "Fill all mandatory fields" });
    } else {
        let result = await userService.loginUser(email, password);
        if('error' in result) {
            res.status(400).json({message: "Login Failed", error: result['error'] });
        } else if('token' in result) {
            res.cookie('token',result['token']);
            res.status(200).json({ message: "Login Successful." });
        }
    }
};
