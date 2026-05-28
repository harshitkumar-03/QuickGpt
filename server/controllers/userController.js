import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Chat from "../models/Chat.js";

// generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// API to register user
export const registerUser = async (req, res) => {

    const { name, email, password } = req.body;

    try {

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.json({
                success: false,
                message: "User already exists"
            });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        const token = generateToken(user._id);

        res.json({
            success: true,
            token
        });

    } catch (error) {

        return res.json({
            success: false,
            message: error.message
        });
    }
};

// API to login user
export const loginUser = async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if (user) {

            const isMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (isMatch) {

                const token = generateToken(user._id);

                return res.json({
                    success: true,
                    token
                });
            }
        }

        return res.json({
            success: false,
            message: "Invalid email or password"
        });

    } catch (error) {

        return res.json({
            success: false,
            message: error.message
        });
    }
};

// API to get user data
export const getUserData = async (req, res) => {

    try {

        const user = req.user;

        return res.json({
            success: true,
            user
        });

    } catch (error) {

        return res.json({
            success: false,
            message: error.message
        });
    }
};
// API TO GET PUBLISHED IMAGES


export const getPublishedImages = async (req, res) => {
  try {
    // assuming images/messages are stored in Chat model
    // and each image message has isPublished: true

    const PublishedImageMessages = await Chat.aggregate([
      { $unwind: "$messages" },
      {
        $match: {
          "messages.isImage": true,
          "messages.isPublished": true,
        },
      },
      {
        $project: {
          _id: 0,
          imageUrl: "$messages.content",
          username: "$username",
        },
      },
    ]);

    res.json({
      success: true,
      images: PublishedImageMessages.reverse(),
    });
  } catch (error) {
    console.error("Error fetching published images:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch published images",
    });
  }
};