import User from "../models/user.model.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { destroyToken, generateToken } from "../lib/util.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        // validate data
        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        // check account exist
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "Email already exist"
            })
        }

        // cb tao tai khoan
        // ma hoa matkhau
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })
        // console.log(newUser._id)
        generateToken(newUser._id, res);
        await newUser.save();
        return res.status(201).json({
            message: "Signed up successfully"
        })
    } catch (error) {
        console.log(`Error updateProfile in auth controller`);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // validate data
        if (!email || !password) {
            return res.status(400).json(
                {
                    message: "All fields are required"
                }
            )
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        // check email existing
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials, Email not found"
            })
        }

        // check password
        const isCorrectedPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectedPassword) {
            return res.status(400).json({
                message: "Wrong password"
            })
        }

        generateToken(user._id, res)
        res.status(200).json({
            message: "Login successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic
            }
        })

    } catch (error) {
        console.log(`Error updateProfile in auth controller`);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const logout = async (req, res) => {
    try {
        destroyToken(res);
        return res.status(200).json({
            message: 'Logged out successfully'
        })
    } catch (error) {
        console.log(`Error updateProfile in auth controller`);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const updateProfile = async (req, res) => {
    const { profilePic } = req.body;
    const userId = req.user._id
    try {
        if (!profilePic) {
            return res.status(400).json({
                message: "Profile pic is required"
            })
        }

        // cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true }).select("-password");
        res.status(200).json({
            message: "Updated user profile successfully",
            user: updatedUser
        })
    } catch (error) {
        console.log(`Error updateProfile in auth controller`);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const check = async (req, res) => {
    const user = req.user;
    try {
        res.status(200).json({
            user
        })
    } catch (error) {
        console.log(`Error updateProfile in auth controller`);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}