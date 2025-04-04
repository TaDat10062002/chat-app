import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";
const routers = express.Router();

routers.get('/users', protectedRoute, getUsersForSidebar);
routers.get('/:id', protectedRoute, getMessages);
routers.post('/send/:id', protectedRoute, sendMessage);

export default routers;