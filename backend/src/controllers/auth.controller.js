import { validationResult } from "express-validator";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signUp = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        // validate data
        if (!fullName || !email || !password) {
            res.status(400).json({
                message: "All fields are required"
            })
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        // check user exist
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: "Email has already exist"
            })
        }

        // hashPassword
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // store data from req.body
        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword,
            profilePic: ''
        })

        await newUser.save();
        generateToken(newUser._id, res)
        return res.status(201).json({
            message: 'Signed up successfully',
            data: newUser
        })
    } catch (error) {
        console.log(`Error signUp in controller ${error.message}`);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}