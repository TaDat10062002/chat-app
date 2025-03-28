import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
const router = express.Router();

// load user for sidebar
router.get('/user', protectedRoute, async (req, res) => {
    try {
        const loggedUserId = req.user._id;
        // show all users but not the currently logged user
        const filteredUsers = await User.find({ _id: { $ne: loggedUserId } })
        return res.status(200).json({
            message: "All users in chat app",
            users: filteredUsers
        })

    } catch (error) {
        console.log(`Error in fetching users at controller ${error.message}`);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

// load tin nhan cho user
router.get('/:id', protectedRoute, async (req, res) => {
    try {
        const { id: others_user_id } = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                // show message i sent to the others
                {
                    senderId: myId, receiverId: others_user_id
                },

                // show message the others sent to me
                {
                    senderId: others_user_id, receiverId: myId
                }
            ]
        })
        return res.status(200).json({
            messages: messages
        })
    } catch (error) {
        console.log(`Error in fetching users at controller ${error.message}`);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }

})

// send message
router.post('/:id', protectedRoute, async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = Message({
            senderId: senderId,
            receiverId: receiverId,
            text: text,
            image: imageUrl
        })

        const message = await newMessage.save();
        return res.status(201).json({
            newMessage: message
        })

    } catch (error) {

    }
})

export default router