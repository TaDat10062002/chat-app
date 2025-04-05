import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
    const token = req.cookies.jwt;
    try {
        if (!token) {
            return res.status(400).json({
                message: "Unauthorised - Token not found"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(400).json({
                message: "Unauthorised - Invalid token"
            })
        }

        const userId = decoded.userId;
        const user = await User.findById(userId).select("-password");
        req.user = user;
        next();
    } catch (error) {
        console.log(`Error in protectedRoute ${error.message}`)
    }
}