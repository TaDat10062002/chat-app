import mongoose from "mongoose";
import dotenv from "dotenv/config.js";
import Message from "../models/message.model.js";

const MONGODB_URI = process.env.MONGODB_URI
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI);
        console.log(`Connected to mongoDB ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error in connect DB ${error.message}`)
    }
}

export const deleteAll = async () => {
    try {
        const rs = await Message.deleteMany({});
    } catch (error) {

    }
}