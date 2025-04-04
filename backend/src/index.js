import express from "express";
import bodyParser from 'express';
import dotenv from 'dotenv/config';
import { connectDB } from "./lib/db.js";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";
import User from "./model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGODB_URI;

app.use(express.json())
app.use(cookieParser());

const validateAuth = [
    body('email')
        .isEmail()
        .withMessage('Invalid Email'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
]

app.post('/api/auth/signup', validateAuth, async (req, res) => {
    try {

        // validate data
        const { fullName, email, password } = req.body;
        const errors = validationResult(req);

        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        // check existing email
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'Email already exists'
            })
        }

        // ma hoa password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        // cb tao user moi
        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword,
            profilePic: ''
        })

        const userId = newUser._id.toString();
        const generateToken = (userId, res) => {
            const time = 7 * 24 * 60 * 60 * 1000;
            // ma hoa thanh token
            const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7 days' });
            // set cookies
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: "strict",
                maxAge: time
            });
            return token;
        }

        generateToken(userId, res);
        await newUser.save();
        res.status(201).json({
            message: 'Sign up successfully',
            newUser: newUser
        })
    } catch (error) {
        console.log(`Error signup in auth controller ${error.message}`);
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
})

app.post('/api/auth/login', validateAuth, async (req, res) => {
    try {
        // validate data
        const { email, password } = req.body;
        const errors = validationResult(req);

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "No credentials found"
            })
        }

        const isCorrectedPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectedPassword) {
            return res.status(400).json({
                message: "Password wrong, please try again"
            })
        }

        const generateToken = (userId, res) => {
            const time = 7 * 24 * 60 * 60 * 1000;
            // ma hoa thanh token
            const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7 days' });
            // set cookies
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: "strict",
                maxAge: time
            });
            return token;
        }
        generateToken(user._id, res);
        return res.status(200).json({
            message: 'Login successfully',
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            }
        })
    } catch (error) {
        console.log(`Error login in auth controller ${error.message}`);
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
})

app.post('/api/auth/logout', (req, res) => {
    try {
        const destroyToken = (res) => {
            const time = 0;
            res.cookie("jwt", '',
                {
                    maxAge: time
                }
            )
        }
        destroyToken(res);
        return res.status(200).json({
            message: 'Logged out successfully'
        })

    } catch (error) {
        console.log(`Error logout in auth controller ${error.message}`)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

app.get('/api/auth/check', async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            res.status(400).json({
                message: "No token founds"
            })
        }
        res.status(200).json({
            message: "User authorized",
        })
    } catch (error) {
        console.log(`Error logout in auth controller ${error.message}`)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

app.put("/api/auth/update-profile", async (req, res) => {
    const token = req.cookies.jwt;
    const { profilePic } = req.body;
    try {
        if (!token) {
            return res.status(400).json({
                message: "Unauthorized - No token found"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(400).json({
                message: "Unauthorized - Invalid token"
            })
        }

        const userId = decoded.userId;
        const user = await User.findById(userId).select("-password");
        req.user = user;

        const updatedUser = await User.findByIdAndUpdate(user._id, { profilePic }, { new: true }).select("-password");
        return res.status(200).json({
            message: "Updated successfully",
            updatedUser
        })
    } catch (error) {
        console.log(`Error updateProfile in auth controller ${error.message}`);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

app.listen(PORT, () => {
    connectDB(MONGO_URI);
    console.log(`Server is running at http://localhost:${PORT}`);
})