import { validationResult } from "express-validator";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { destroyToken, generateToken } from "../middleware/auth.middleware.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
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

        generateToken(newUser._id, res);
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
}

export const login = async (req, res) => {
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
}

export const logout = (req, res) => {
    try {
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
}

export const check = async (req, res) => {
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
}

export const updateProfile = async (req, res) => {
    const { profilePic } = req.body;
    const userId = req.user._id;
    try {
        if (!profilePic) {
            res.status(400).json({
                message: "Image is required"
            })
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })
        res.status(200).json({ updatedUser })
    } catch (error) {
        console.log(`Error updateProfile in auth controller ${error.message}`);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}