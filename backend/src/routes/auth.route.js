import express from "express";
import { validateAuth } from "../middleware/validateAuth.middleware.js";
import { login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post('/sign-up', validateAuth, signup);

router.post('/login', validateAuth, login)

router.post('/logout', logout)

router.put('/update-profile', protectedRoute, updateProfile)

export default router;