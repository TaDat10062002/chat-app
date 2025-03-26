import express from "express";
import { validateAuth } from "../middleware/validateAuth.middleware.js";
import { login, signup } from "../controllers/auth.controller.js";
const router = express.Router();

router.post('/sign-up', validateAuth, signup);

router.post('/login', login)

router.post('/logout', (req, res) => {
    res.send('Logged out')
})

export default router;