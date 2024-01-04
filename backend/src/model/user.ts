import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
}

const UserSchema: Schema = new Schema({
    name : {
        type:String,
        required: true
    },
    email : {
        type:String,
        required: true,
        unique: true
    },
    phone : {
        type:String,
        required: true,
    },
    password : {
        type:String,
        required: true,
    }, 
    role: {
        type: String,
        default: 'user', // Set the default value to 'user'
        enum: ['user', 'admin']
    }
}, {collection: 'users'});

export default mongoose.model<IUser>('users', UserSchema);

