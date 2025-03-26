import express from "express";
import { connectDB } from "./lib/db.js";
import authRoutes from './routes/auth.route.js'
const app = express();
const PORT = process.env.PORT;

// data from req body
app.use(express.json());
app.use("/api/auth", authRoutes)
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running at http://localhost:${PORT}`);
})