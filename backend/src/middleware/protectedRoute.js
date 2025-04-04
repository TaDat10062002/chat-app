import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const protectedRoute = async (req, res, next) => {
    const token = req.cookies.jwt;
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
    next();
}