import express from "express";
import { validateAuth } from "../middleware/validateAuth.middleware.js";
import { login, logout, signup } from "../controllers/auth.controller.js";
const router = express.Router();

router.post('/sign-up', validateAuth, signup);

router.post('/login', validateAuth, login)

router.post('/logout', logout)


export default router;