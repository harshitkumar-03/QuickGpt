import axios from "axios";
import openai from "../configs/openai.js";
import imagekit from "../configs/imagekit.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

// text based ai chat message controller
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    // check credits
    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "You don't have enough credit",
      });
    }

    const { chatId, prompt } = req.body;

    // validation
    if (!chatId || !prompt) {
      return res.json({
        success: false,
        message: "Missing details",
      });
    }

    // find chat
    const chat = await Chat.findOne({
      userId,
      _id: chatId,
    });

    if (!chat) {
      return res.json({
        success: false,
        message: "Chat not found",
      });
    }

    // save user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: new Date(),
      isImage: false,
    });

    // ai response
   const completion =
  await openai.chat.completions.create({
    model: "google/gemini-3.1-flash-lite",

    messages: chat.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),

    max_tokens: 4096,
  });

    const reply = {
      role: "assistant",
      content: completion.choices[0].message.content,
      timestamp: new Date(),
      isImage: false,
    };

    // save assistant reply
    chat.messages.push(reply);

    await chat.save();

    // decrease credits
    await User.updateOne(
      { _id: userId },
      { $inc: { credits: -1 } }
    );

    return res.json({
      success: true,
      reply,
    });

  } catch (error) {
    console.log("TEXT ERROR => ", error);

    return res.json({
      success: false,
      message:
        error.response?.data?.error?.message ||
        error.message,
    });
  }
};

// image generation controller
export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    // check credits
    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You don't have enough credit",
      });
    }

    const { prompt, chatId, isPublished } = req.body;

    // validation
    if (!prompt || !chatId) {
      return res.json({
        success: false,
        message: "Missing details",
      });
    }

    // find chat
    const chat = await Chat.findOne({
      userId,
      _id: chatId,
    });

    if (!chat) {
      return res.json({
        success: false,
        message: "Chat not found",
      });
    }

    // save user prompt
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: new Date(),
      isImage: false,
    });

    // encode prompt
    const encodedPrompt = encodeURIComponent(prompt);

    // generate image url
    const generatedImageUrl =
      `${process.env.IMAGEKIT_URL_ENDPOINT}/` +
      `ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

    // fetch image
    const aiImageResponse = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
    });

    // convert to base64
    const base64Image = `data:image/png;base64,${Buffer.from(
      aiImageResponse.data,
      "binary"
    ).toString("base64")}`;

    // upload to imagekit
    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "/quickgpt",
    });

    // assistant reply
    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: new Date(),
      isImage: true,
      isPublished: isPublished || false,
    };

    // save reply
    chat.messages.push(reply);

    await chat.save();

    // decrease credits
    await User.updateOne(
      { _id: userId },
      { $inc: { credits: -2 } }
    );

    return res.json({
      success: true,
      reply,
    });

  } catch (error) {
    console.log("IMAGE ERROR => ", error);

    return res.json({
      success: false,
      message:
        error.response?.data?.error?.message ||
        error.message,
    });
  }
};