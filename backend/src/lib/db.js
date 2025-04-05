import mongoose from 'mongoose';
import Message from '../model/message.model.js';
export const connectDB = async (MONGO_URI) => {
    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`Connected to mongoDB ${conn.connection.host}`)
    } catch (error) {
        console.log(`Failed to connecting with mongo ${error}`);
    }
}

export const deleteAllMessages = async () => {
    try {
        await Message.deleteMany({});
    } catch (error) {

    }
}