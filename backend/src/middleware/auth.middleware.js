import jwt from "jsonwebtoken";
import User from "../models/user.model.js"

export const protectedRoute = async (req, res, next) => {
    const token = req.cookies.jwt;
    try {
        // check exist token
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized - No token was found"
            })
        }

        // check token valid
        const decoded = jwt.decode(token);
        if (!decoded) {
            return res.status(400).json({
                message: "Unauthorized - Invalid token!!!"
            })
        }

        // find user 
        const _id = decoded.userId;
        const user = await User.findById(_id).select("-password");

        // check user exist?
        if (!user) {
            return res.status(404).json({
                message: "User not found!!!"
            })
        }
        req.user = user;
        // call the next function
        next();

    } catch (error) {
        console.log(`Error protectedRoute in middleware ${error.message}`);
        req.status(500).json({
            message: "Internal Server Error"
        })
    }
}