import jwt from "jsonwebtoken";
export const generateToken = (userId, res) => {
    const time = 7 * 24 * 60 * 60 * 1000;
    // ma hoa thanh token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7 days' });
    // set cookies
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: time
    });
    return token;
}

export const destroyToken = (res) => {
    const time = 0;
    res.cookie("jwt", '',
        {
            maxAge: time
        }
    )
}