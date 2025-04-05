import express from "express";
import { validateAuth } from "../middleware/validateAuth.js";
import { check, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
const routers = express.Router();

routers.post('/signup', validateAuth, signup)

routers.post('/login', validateAuth, login)

routers.post('/logout', logout)

routers.put('/update-profile', protectedRoute, updateProfile)

routers.get('/check', protectedRoute, check)

export default routers