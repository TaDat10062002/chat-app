import User from "../model/user.model.js"
import Message from "../model/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
    const userId = req.user._id
    try {
        const filteredUser = await User.find({ _id: { $ne: userId } });
        return res.status(200).json({
            filteredUser
        })
    } catch (error) {
        console.log(`Error in fetching user at message controller ${error.message}`);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const getMessages = async (req, res) => {
    const senderId = req.user._id;
    const { id: receiverId } = req.params;
    try {
        const messages = await Message.find(
            {
                $or: [
                    { senderId: senderId, receiverId: receiverId },
                    { receiverId: senderId, senderId: receiverId }
                ]
            }
        )
        res.status(200).json({
            messages
        })
    } catch (error) {
        console.log(`Error sendMessage in message controller ${error.message}`);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const sendMessage = async (req, res) => {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    try {
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            text: text,
            image: imageUrl
        })

        await newMessage.save();
        return res.status(201).json({ newMessage })
    } catch (error) {
        console.log(`Error sendMessage in message controller ${error.message}`);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}