import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";
const router = express.Router();

// load user for sidebar
router.get('/user', protectedRoute, getUsersForSidebar)

// load tin nhan cho user
router.get('/:id', protectedRoute, getMessages)

// send message
router.post('/:id', protectedRoute, sendMessage)

export default router