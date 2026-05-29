import express from "express";
import {
    createChat,
    getChats,
    deleteChat
} from "../controllers/chatController.js";

import { protect } from "../middleware/auth.js";

const chatRouter = express.Router();

chatRouter.get("/get",protect,getChats);

chatRouter.get("/create",protect,createChat);

chatRouter.post("/delete", protect, deleteChat);

export default chatRouter;