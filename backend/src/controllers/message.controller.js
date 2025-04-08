import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import CryptoJS from "crypto-js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    const loggedUserId = req.user._id;
    try {
        const filteredUsers = await User.find({ _id: { $ne: loggedUserId } })
        res.status(200).json({
            filteredUsers,
            users: filteredUsers.length
        })
    } catch (error) {
        console.log(`Error getUsersForSidebar in message controller`);
        res.status(500).json({
            message: "Interal Server Error"
        })
    }
}

export const getMessage = async (req, res) => {
    const senderId = req.user._id;
    const receiverId = req.params.id;
    try {
        // hoac la tim tin nhan của mình hoặc là của ngta tới mình
        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        })

        // decoded tin nhan api cho FE
        const decodedMessage = messages.map((message) => ({
            senderId: message.senderId,
            receiverId: message.receiverId,
            text: CryptoJS.AES.decrypt(message.text, process.env.CRYPTOJS_SECRET).toString(CryptoJS.enc.Utf8),
            image: message.image
        }))

        res.status(200).json({
            messages: decodedMessage
        })
    } catch (error) {
        console.log(`Error getUsersForSidebar in message controller`);
        res.status(500).json({
            message: "Interal Server Error"
        })
    }
}

export const sendMessage = async (req, res) => {
    const { text, image } = req.body;
    const senderId = req.user._id;
    const receiverId = req.params.id;
    try {
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // ma hoa tin nhan nguoi dung
        console.log(process.env.CRYPTOJS_SECRET);
        const encodedText = CryptoJS.AES.encrypt(text, process.env.CRYPTOJS_SECRET);
        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            text: encodedText,
            image: imageUrl
        })
        await newMessage.save();

        // fix vu khi nguoi dung chat se bi ma hoa
        newMessage.text = text;
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json(
            newMessage
        )

    } catch (error) {
        console.log(`Error getUsersForSidebar in message controller`);
        res.status(500).json({
            message: "Interal Server Error"
        })
    }
}