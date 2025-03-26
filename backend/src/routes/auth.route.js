import express from "express";
import { validateAuth } from "../middleware/validateAuth.middleware.js";
import { signUp } from "../controllers/auth.controller.js";
const router = express.Router();

router.post('/sign-up', validateAuth, signUp);

router.post('/login', (req, res) => {
    res.send('Login page')
})

router.post('/logout', (req, res) => {
    res.send('Logged out')
})

export default router;