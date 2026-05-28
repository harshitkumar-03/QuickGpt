import axios from "axios";
import openai from "../configs/openai.js";
import imagekit from "../configs/imagekit.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

// text based ai chat message controller
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "You don't have enough credit",
      });
    }

    const { chatId, prompt } = req.body;

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

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

   const completion =
  await openai.chat.completions.create({

    model: "google/gemini-2.0-flash-001",

    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],

  });

const reply = {
  role: "assistant",
  content: completion.choices[0].message.content,
  timestamp: Date.now(),
  isImage: false,
};

    chat.messages.push(reply);

    await chat.save();

    await User.updateOne(
      { _id: userId },
      { $inc: { credits: -1 } }
    );

    return res.json({
      success: true,
      reply,
    });

  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
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
      timestamp: Date.now(),
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

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
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
  }  catch (error) {
  console.log("FULL ERROR => ", error);

  return res.json({
    success: false,
    message: error.message,
  });
}
}