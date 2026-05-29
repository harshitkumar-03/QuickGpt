import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "../components/Message";
import toast from "react-hot-toast";

const Chatbox = () => {
  const containerRef = useRef(null);

  const {
    selectedChat,
    theme,
    user,
    axios,
    token,
    setUser,
  } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  // send message
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user) {
        return toast("Login to send message");
      }

      if (!selectedChat) {
        return toast.error("No chat selected");
      }

      setLoading(true);

      const promptCopy = prompt;

      // add user message instantly
      const userMessage = {
        role: "user",
        content: prompt,
        timestamp: Date.now(),
        isImage: false,
      };

      setMessages((prev) => [...prev, userMessage]);

      setPrompt("");

      const { data } = await axios.post(
        `/api/message/${mode}`,
        {
          chatId: selectedChat._id,
          prompt,
          isPublished,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        // add ai reply
        setMessages((prev) => [...prev, data.reply]);

        // decrease credits
        if (mode === "image") {
          setUser((prev) => ({
            ...prev,
            credits: prev.credits - 2,
          }));
        } else {
          setUser((prev) => ({
            ...prev,
            credits: prev.credits - 1,
          }));
        }
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPrompt('')
      setLoading(false);
    }
  };

  // load selected chat messages
  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || []);
    }
  }, [selectedChat]);

  // auto scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30
      max-md:mt-14 2xl:pr-40"
    >
      {/* Chat Messages */}
      <div
        ref={containerRef}
        className="flex-1 mb-5 overflow-y-scroll"
      >
        {messages.length === 0 && (
          <div
            className="h-full flex flex-col items-center justify-center gap-2
            text-primary"
          >
            <img
              src={
                theme === "dark"
                  ? assets.logo_full
                  : assets.logo_full_dark
              }
              alt=""
              className="w-full max-w-56 sm:max-w-68"
            />

            <p
              className="mt-5 text-4xl sm:text-6xl text-center
              text-gray-400 dark:text-white"
            >
              Ask me anything
            </p>
          </div>
        )}

        {/* Messages */}
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {/* Loading */}
        {loading && (
          <div className="loader flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>

            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce [animation-delay:0.2s]"></div>

            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
      </div>

      {/* Publish checkbox */}
      {mode === "image" && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
          <p className="text-xs">
            Publish Generated Image to Community
          </p>

          <input
            type="checkbox"
            className="cursor-pointer"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </label>
      )}

      {/* Prompt Input */}
      <form
        onSubmit={onSubmit}
        className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30
        rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex items-center gap-4"
      >
        {/* Mode Select */}
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="text-sm outline-none bg-transparent"
        >
          <option
            value="text"
            className="dark:bg-purple-900"
          >
            Text
          </option>

          <option
            value="image"
            className="dark:bg-purple-900"
          >
            Image
          </option>
        </select>

        {/* Prompt Input */}
        <input
          type="text"
          placeholder="Type your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm"
          required
        />

        {/* Send Button */}
        <button disabled={loading}>
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            alt="send"
            className="w-8 cursor-pointer"
          />
        </button>
      </form>
    </div>
  );
};

export default Chatbox;