import jwt from "jsonwebtoken";

export const generateToken = async (userId, res) => {
    const times = 7 * 24 * 60 * 60 * 1000;
    // encode id from jwt
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "7 days" }
    )
    res.cookie("jwt", token, {
        maxAge: times,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    })
    return token;
}

export const destroyToken = async (res) => {
    const times = 0;
    res.cookie("jwt", '', {
        maxAge: times
    })
}

export const encodedTextContent = async (text) => {
    
}