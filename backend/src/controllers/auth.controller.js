import { validationResult } from "express-validator";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    const errors = validationResult(req);
    try {
        // validate data
        if (!fullName || !email || !password) {
            res.status(400).json({
                message: "All fields are required"
            })
        }

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
        console.log(`Error signup in controller ${error.message}`);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    try {
        // validate data
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array()
            })
        }

        // check email exist
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "No credentials found!!!, Please check your Email"
            })
        }

        // check password
        const hash = user.password;
        const isCorrectedPassword = await bcrypt.compare(password, hash);
        if (!isCorrectedPassword) {
            return res.status(400).json({
                message: "Incorrect Password, Please try again"
            })
        }

        // login
        const _id = user._id;
        generateToken(_id, res);
        res.status(200).json({
            message: "Login successfully!",
            user: {
                _id: user.id,
                fullName: user.fullName,
                profilePic: user.profilePic
            }
        })
    } catch (error) {
        console.log(`Error login in controller ${error.message}`);
        res.status(500).jso({
            message: "Internal Server Error"
        })
    }
}

export const logout = (req, res) => {
    res.send('Logged out')
}