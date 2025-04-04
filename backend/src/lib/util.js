import { body } from "express-validator";

export const validateAuth = [
    body('email')
        .isEmail()
        .withMessage('Invalid Email'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
]
