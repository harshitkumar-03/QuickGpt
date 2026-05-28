import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {

    try {

        let token = req.headers.authorization;

        // check token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, no token"
            });
        }

        // remove Bearer from token
        token = token.split(" ")[1];

        // verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // find user
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // attach user to request
        req.user = user;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Not authorized, token failed"
        });
    }
};