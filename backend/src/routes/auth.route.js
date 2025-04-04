import express from "express";
import { login, logout, signup, updateProfile, check } from '../controllers/auth.controller.js';
import { validateAuth } from "../lib/util.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
const routers = express.Router();

routers.post('/signup', validateAuth, signup);
routers.post('/login', validateAuth, login);
routers.post('/logout', logout);
routers.get('/check', check);
routers.put('/update-profile', protectedRoute, updateProfile);

export default routers;