import express from "express";
import { validateAuth } from "../middleware/validateAuth.js";
import { login, logout, signup } from "../controllers/auth.controller.js";
const routers = express.Router();

routers.post('/signup', validateAuth, signup)

routers.post('/login', validateAuth, login)

routers.post('/logout', logout)

export default routers