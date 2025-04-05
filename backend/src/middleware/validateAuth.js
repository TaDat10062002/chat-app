import { body } from "express-validator";

export const validateAuth = [
    body('email')
        .isEmail()
        .withMessage("Invalid email, please try again"),

    body('password')
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
]


