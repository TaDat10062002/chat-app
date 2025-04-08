import mongoose from "mongoose";
import Message from "../models/message.model.js";

export const connectDB = async (MONGODB_URI) => {
    try {
        const conn = await mongoose.connect(MONGODB_URI)
        console.log(`Connected to mongoDB successfully ${conn.connection.host}`)
    } catch (error) {
        console.log(`Failed to connecting mongoDB ${error}`)
    }
}

// xoa message
export const deleteMessages = async () => {
    try {
        await Message.deleteMany({})
    } catch (error) {

    }
}