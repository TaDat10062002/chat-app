import { body } from "express-validator";

export const validateAuth = [
    body('email')
        .isEmail()
        .withMessage('Invalid Email'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    body('fullName')
        .isLength({ max: 15 })
        .withMessage('Full name maximum is 15 characters'),
]