import Chat from "../models/Chat.js";

// create new chat
export const createChat = async (req,res) => {
    try {

        const userId = req.user._id;

        const chatData = {
            userId,
            username:req.user.name,
            name:"newchat",
            messages:[]
        };

        const chat = await Chat.create(chatData);

        res.json({
            success:true,
            chat
        });

    } catch (error) {
        res.json({
            success:false,
            message:error.message
        });
    }
};

// get all chats
export const getChats = async (req,res) => {
    try {

        const chats = await Chat.find({
            userId:req.user._id
        }).sort({updatedAt:-1});

        res.json({
            success:true,
            chats
        });

    } catch (error) {
        res.json({
            success:false,
            message:error.message
        });
    }
};

// delete chat
export const deleteChat = async (req,res) => {
    try {

        const userId = req.user._id;

        const { chatId } = req.body;

        await Chat.deleteOne({
            _id: chatId,
            userId
        });

        res.json({
            success:true,
            message:"Chat deleted"
        });

    } catch (error) {
        res.json({
            success:false,
            message:error.message
        });
    }
};