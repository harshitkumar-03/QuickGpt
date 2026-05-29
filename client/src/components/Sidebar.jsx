import React, { useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";

import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    chats,
    setSelectedChat,
    theme,
    setTheme,
    navigate,
    user,
    createNewChat,
    axios,
    setChats,
    fetchUserChats,
    setToken,
    token,
  } = useAppContext();

  const [search, setSearch] = useState("");

  // ================= LOGOUT =================

  const logOut = () => {
    localStorage.removeItem("token");

    setToken(null);
    setChats([]);
    setSelectedChat(null);

    navigate("/");

    toast.success("Logged out successfully");
  };

  // ================= DELETE CHAT =================

  const deleteChat = async (e, chatId) => {
    e.stopPropagation();

    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this chat?"
      );

      if (!confirmDelete) return;

      const { data } = await axios.post(
  "/api/chat/delete",
  { chatId },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      if (data.success) {
        setChats((prev) =>
          prev.filter((chat) => chat._id !== chatId)
        );

        await fetchUserChats();

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  // ================= FILTER CHATS =================

  const filteredChats = chats.filter((chat) => {
    if (chat.messages?.[0]?.content) {
      return chat.messages[0].content
        .toLowerCase()
        .includes(search.toLowerCase());
    }

    return chat.name
      ?.toLowerCase()
      .includes(search.toLowerCase());
  });

  return (
    <div
      className={`flex flex-col h-screen w-72 p-5
      dark:bg-gradient-to-b dark:from-[#242124]/30 dark:to-[#000000]/30
      border-r border-[#80609F]/30 backdrop-blur-3xl
      transition-all duration-500
      max-md:absolute left-0 z-10
      bg-white dark:bg-black
      ${
        !isMenuOpen
          ? "max-md:-translate-x-full"
          : "translate-x-0"
      }`}
    >
      {/* LOGO */}

      <img
        src={
          theme === "dark"
            ? assets.logo_full
            : assets.logo_full_dark
        }
        alt="QuickGPT Logo"
        className="w-40 object-contain"
      />

      {/* NEW CHAT */}

      <button
        onClick={createNewChat}
        className="flex items-center justify-center
        w-full mt-10 py-2 rounded-md
        text-sm text-white cursor-pointer
        bg-gradient-to-r from-[#633297] to-[#496ba7]"
      >
        <span className="mr-2 text-lg">+</span>
        New Chat
      </button>

      {/* SEARCH */}

      <div
        className="flex items-center gap-2 mt-4 p-3 rounded-md
        border border-gray-300 dark:border-white/20"
      >
        <img
          src={assets.search_icon}
          alt="Search"
          className="w-4 dark:invert"
        />

        <input
          type="text"
          placeholder="Search conversations"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent outline-none
          text-sm placeholder:text-gray-400"
        />
      </div>

      {/* RECENT CHATS */}

      {filteredChats.length > 0 && (
        <>
          <p className="mt-5 mb-2 text-sm font-medium">
            Recent Chats
          </p>

          <div className="flex flex-col gap-2 overflow-y-auto">
            {filteredChats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => {
                  navigate("/");
                  setSelectedChat(chat);
                  setIsMenuOpen(false);
                }}
                className="chat-item flex items-center justify-between
                p-3 rounded-md cursor-pointer
                border border-gray-300
                dark:border-[#80609F]/15
                dark:bg-[#57317C]/10
                hover:bg-gray-100
                dark:hover:bg-[#57317C]/20
                transition-all"
              >
                {/* LEFT CONTENT */}

                <div className="overflow-hidden flex-1">
                  <p className="truncate text-sm">
                    {chat.messages?.length > 0
                      ? chat.messages[0]?.content?.slice(
                          0,
                          32
                        )
                      : chat.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    Click to open
                  </p>

                  <p className="text-xs text-gray-400 dark:text-[#B1A6C0]">
                    {moment(chat.updatedAt).fromNow()}
                  </p>
                </div>

                {/* DELETE ICON */}

                <img
                  src={assets.bin_icon}
                  alt="Delete"
                  onClick={(e) => deleteChat(e, chat._id)}
                  className="delete-btn w-4 h-4 ml-2 cursor-pointer flex-shrink-0"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* COMMUNITY */}

      <div
        onClick={() => {
          navigate("/community");
          setIsMenuOpen(false);
        }}
        className="flex items-center gap-3 p-3 mt-4
        border border-gray-300 dark:border-white/15
        rounded-md cursor-pointer
        hover:scale-105 transition-all"
      >
        <img
          src={assets.gallery_icon}
          alt="Gallery"
          className="w-4 dark:invert"
        />

        <div className="flex flex-col text-sm">
          <p>Community Images</p>
        </div>
      </div>

      {/* CREDITS */}

      <div
        onClick={() => {
          navigate("/credits");
          setIsMenuOpen(false);
        }}
        className="flex items-center gap-3 p-3 mt-4
        border border-gray-300 dark:border-white/15
        rounded-md cursor-pointer
        hover:scale-105 transition-all"
      >
        <img
          src={assets.diamond_icon}
          alt="Credits"
          className="w-4 dark:invert"
        />

        <div className="flex flex-col text-sm">
          <p>Credits : {user?.credits}</p>

          <p className="text-xs text-gray-400">
            Purchase credits to use QuickGPT
          </p>
        </div>
      </div>

      {/* DARK MODE */}

      <div
        className="flex items-center justify-between
        p-3 mt-4 border border-gray-300
        dark:border-white/15 rounded-md"
      >
        <div className="flex items-center gap-2">
          <img
            src={assets.theme_icon}
            className="w-4 dark:invert"
            alt=""
          />

          <p className="text-sm">Dark Mode</p>
        </div>

        <label className="relative inline-flex cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={theme === "dark"}
            onChange={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
          />

          <div
            className="w-10 h-5 bg-gray-400 rounded-full
            peer-checked:bg-purple-600 transition-all"
          ></div>

          <span
            className="absolute left-1 top-1
            w-3 h-3 bg-white rounded-full
            transition-transform peer-checked:translate-x-5"
          ></span>
        </label>
      </div>

      {/* USER */}

      <div
        className="user-item relative flex items-center gap-3 p-3 mt-4
        border border-gray-300 dark:border-white/15
        rounded-md"
      >
        <img
          src={assets.user_icon}
          className="w-8 rounded-full"
          alt=""
        />

        <p className="flex-1 text-sm truncate">
          {user ? user.name : "Login your account"}
        </p>

        {/* LOGOUT ICON */}

        {user && (
          <img
            onClick={logOut}
            src={assets.logout_icon}
            alt="logout"
            className="logout-btn w-5 h-5 cursor-pointer flex-shrink-0"
          />
        )}

        {/* MOBILE CLOSE */}

        <img
          onClick={() => setIsMenuOpen(false)}
          src={assets.close_icon}
          className="absolute top-3 right-3 w-5 h-5
          cursor-pointer md:hidden dark:invert"
          alt=""
        />
      </div>
    </div>
  );
};

export default Sidebar;