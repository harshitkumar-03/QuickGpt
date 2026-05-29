import React, { useEffect } from "react";
import moment from "moment";
import Markdown from "react-markdown";
import Prism from "prismjs";

import { assets } from "../assets/assets";

import "prismjs/themes/prism.css";

const Message = ({ message }) => {

  useEffect(() => {
    Prism.highlightAll();

    // Debug
    console.log("MESSAGE:", message);

    if (message.isImage) {
      console.log("IMAGE URL:", message.content);
    }

  }, [message]);

  const isUser = message.role === "user";

  return (
    <div
      className={`flex my-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <img
          src={assets.logo_icon}
          alt="AI"
          className="w-8 h-8 rounded-full mr-2 mt-1"
        />
      )}

      <div
        className={`flex flex-col gap-2 p-3 px-4 border rounded-2xl max-w-[80%]
        ${
          isUser
            ? "bg-slate-50 dark:bg-[#57317C]/30 border-[#80609F]/30"
            : "bg-primary/20 dark:bg-[#57317C]/20 border-[#80609F]/20"
        }`}
      >
        {message.isImage ? (
          <img
            src={message.content}
            alt="Generated"
            className="w-full max-w-md rounded-xl"
            loading="lazy"
            onLoad={() => console.log("✅ Image Loaded")}
            onError={() => {
              console.log("❌ Image Failed");
              console.log("Failed URL:", message.content);
            }}
          />
        ) : (
          <div className="text-sm dark:text-primary whitespace-pre-wrap reset-tw overflow-x-auto">
            <Markdown>
              {message.content}
            </Markdown>
          </div>
        )}

        <span className="text-xs text-gray-400 dark:text-[#B1A6C0]">
          {moment(message.timestamp).fromNow()}
        </span>
      </div>

      {isUser && (
        <img
          src={assets.user_icon}
          alt="User"
          className="w-8 h-8 rounded-full ml-2 mt-1"
        />
      )}
    </div>
  );
};

export default Message;