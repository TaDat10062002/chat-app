import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB, deleteMessages } from './lib/db.js';
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;
// Enable CORS for all routes and origins
app.use(cors({
    origin: 'http://localhost:5173', // Allow only this origin
    credentials: true, // Enable cookies and authorization headers
}));

// apply using body json
app.use(express.json());

// apply using cookie
app.use(cookieParser());

// apply routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// deleteMessages();

app.listen(PORT, () => {
    connectDB(MONGODB_URI);
    console.log(`Server is running at http://localhost:${PORT}`);
})