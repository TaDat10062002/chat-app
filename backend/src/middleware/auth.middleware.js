import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const time = 7 * 24 * 60 * 60 * 1000;
    // encoded id for token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
    // set cookies
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: false,
        maxAge: time,
        sameSite: "strict"
    })
    return token;
}

export const destroyToken = (res) => {
    const time = 0;
    res.cookie('jwt', '', { maxAge: time })
}