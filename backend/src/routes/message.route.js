import express from "express";
import { getMessage, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
const routers = express.Router();

routers.get('/users', protectedRoute, getUsersForSidebar);

routers.get('/:id', protectedRoute, getMessage)

routers.post('/send/:id', protectedRoute, sendMessage);

export default routers;