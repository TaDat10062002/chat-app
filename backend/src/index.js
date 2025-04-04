import express from "express";
import dotenv from 'dotenv/config';
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGODB_URI;

app.use(express.json())
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages/", messageRoutes);


app.listen(PORT, () => {
    connectDB(MONGO_URI);
    console.log(`Server is running at http://localhost:${PORT}`);
})