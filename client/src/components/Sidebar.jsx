import React, { useState } from "react";
import moment from "moment";

import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Sidebar = ({isMenuOpen,setIsMenuOpen}) => {

  const {
    chats,
    setSelectedChat,
    theme,
    setTheme,
    navigate,
    user,
  } = useAppContext();

  const [search, setSearch] = useState("");

  // Filter chats
  const filteredChats = chats.filter((chat) => {

    if (chat.messages[0]) {
      return chat.messages[0]?.content
        .toLowerCase()
        .includes(search.toLowerCase());
    }

    return chat.name
      .toLowerCase()
      .includes(search.toLowerCase());

  });

  return (

    <div
  className={`flex flex-col h-screen w-72 p-5
  dark:bg-gradient-to-b dark:from-[#242124]/30 dark:to-[#000000]/30
  border-r border-[#80609F]/30 backdrop-blur-3xl
  transition-all duration-500
  max-md:absolute left-0 z-10
  ${!isMenuOpen ? "max-md:-translate-x-full" : "translate-x-0"}`}
>
      {/* Logo */}
      <img
        src={
          theme === "dark"
            ? assets.logo_full
            : assets.logo_full_dark
        }
        alt="QuickGPT Logo"
        className="w-40 object-contain"
      />

      {/* New Chat Button */}
      <button
        className="flex items-center justify-center
        w-full mt-10 py-2 rounded-md
        text-sm text-white cursor-pointer
        bg-gradient-to-r from-[#633297] to-[#496ba7]"
      >

        <span className="mr-2 text-lg">+</span>
        New Chat

      </button>

      {/* Search Box */}
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

      {/* Recent Chats */}
      {filteredChats.length > 0 && (
        <>

          <p className="mt-5 mb-2 text-sm font-medium">
            Recent Chats
          </p>

          <div className="flex flex-col gap-2 overflow-y-auto">

            {filteredChats.map((chat) => (

             <div key={chat._id} onClick={() => {navigate("/");setSelectedChat(chat);
                setIsMenuOpen(false);
  }}
                className="flex items-center justify-between
                p-3 rounded-md cursor-pointer
                border border-gray-300
                dark:border-[#80609F]/15
                dark:bg-[#57317C]/10
                hover:bg-gray-100
                dark:hover:bg-[#57317C]/20
                transition-all"
              >

                <div className="overflow-hidden">

                  <p className="truncate text-sm">

                    {chat.messages.length > 0
                      ? chat.messages[0].content.slice(0, 32)
                      : chat.name}

                  </p>

                  <p className="text-xs text-gray-500">
                    Click to open
                  </p>

                  <p className="text-xs text-gray-400 dark:text-[#B1A6C0]">

                    {moment(chat.updatedAt).fromNow()}

                  </p>

                </div>

               <img
  src={assets.bin_icon}
  alt="Delete"
  className="w-4 h-4 cursor-pointer
  opacity-100 group-hover:opacity-200
  transition-all duration-200
  not-dark:invert"
/>

              </div>

            ))}

          </div>

        </>
      )}

      {/* Community Images */}
      <div 
        onClick={() => {navigate("/community");setIsMenuOpen(false)}}
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

      {/* Credits */}
      <div
        onClick={() => {navigate("/credits");setIsMenuOpen(false)}}
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

          <p>
            Credits : {user?.credits}
          </p>

          <p className="text-xs text-gray-400">
            Purchase credits to use QuickGPT
          </p>

        </div>

      </div>

      {/* Dark Mode */}
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

          <p className="text-sm">
            Dark Mode
          </p>

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

      {/* User Account */}
      <div
        className="flex items-center gap-3 p-3 mt-4
        border border-gray-300 dark:border-white/15
        rounded-md cursor-pointer group"
      >

        <img
          src={assets.user_icon}
          className="w-8 rounded-full"
          alt=""
        />

        <p className="flex-1 text-sm truncate">

          {user ? user.name : "Login your account"}

        </p>

       {user && (
  <img
    src={assets.logout_icon}
    alt="logout"
    className="w-5 h-5 cursor-pointer hidden not-dark:invert group-hover:block"
  />
)}
<img onClick ={()=>setIsMenuOpen(false)} src ={assets.close_icon} className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert " alt = ""/>

      </div>

    </div>

  );
};

export default Sidebar;