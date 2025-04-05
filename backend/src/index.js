import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import dotenv from "dotenv/config.js";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

// apply using body json
app.use(express.json());

// apply using cookie
app.use(cookieParser());

// apply routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.listen(PORT, () => {
    connectDB(MONGODB_URI);
    console.log(`Server is running at http://localhost:${PORT}`);
})