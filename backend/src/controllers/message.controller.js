import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import CryptoJS from "crypto-js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedUserId = req.user._id;
        // show all users but not the currently logged user
        const filteredUsers = await User.find({ _id: { $ne: loggedUserId } }).select("-password")
        return res.status(200).json(filteredUsers)

    } catch (error) {
        console.log(`Error in fetching users at controller ${error.message}`);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const getMessages = async (req, res) => {
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
        return res.status(200).json(messages)
    } catch (error) {
        console.log(`Error in fetching users at controller ${error.message}`);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }

}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        const encodedText = CryptoJS.AES.encrypt(text, process.env.CRYPTOJS_SECRET).toString();
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = Message({
            senderId: senderId,
            receiverId: receiverId,
            text: encodedText,
            image: imageUrl
        })

        const message = await newMessage.save();
        return res.status(201).json({
            newMessage: message
        })

    } catch (error) {
        console.log(`Error in fetching users at controller ${error.message}`);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}