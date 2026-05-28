import express from "express";
import { protect } from "../middleware/auth.js";
import {
  textMessageController,
  imageMessageController
} from "../controllers/messageController.js";

const messageRouter = express.Router();

// Send text message
messageRouter.post("/text", protect, textMessageController);

// Send image message
messageRouter.post("/image", protect, imageMessageController);


export default messageRouter;