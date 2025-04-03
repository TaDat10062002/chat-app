import { validationResult } from "express-validator";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import { destroyToken, generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

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

        // if user moi store in db
        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save();
            return res.status(201).json({
                message: 'Signed up successfully',
                user: {
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic: newUser.profilePic,
                }
            })
        }

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
        res.status(200).json(
            {
                _id: user.id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic
            }
        )
    } catch (error) {
        console.log(`Error login in controller ${error.message}`);
        res.status(500).jso({
            message: "Internal Server Error"
        })
    }
}

export const logout = (req, res) => {
    try {
        destroyToken(res);
        return res.status(200).json({
            message: "Logged out successfully"
        })
    } catch (error) {
        console.log(`Error login in controller ${error.message}`);
        res.status(500).jso({
            message: "Internal Server Error"
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id
        // validate data
        if (!profilePic) {
            return res.status(400).json({
                message: "Profile pic is required"
            })
        }

        // authorized and update
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })
        res.status(200).json(updatedUser)
    } catch (error) {
        console.log(`Error updateProfile in controller ${error.message}`);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const checkAuth = async (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        console.log(`Error checkAuths in controller ${error.message}`);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}