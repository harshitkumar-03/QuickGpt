import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const [loadingUser, setLoadingUser] = useState(true);

  // ================= FETCH USER =================

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoadingUser(false);
    }
  };

  // ================= FETCH USER CHATS =================

  const fetchUserChats = async () => {
    try {
      const { data } = await axios.get("/api/chat/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setChats(data.chats);

        // If no chats exist
        if (data.chats.length === 0) {
          await createNewChat();
        } else {
          setSelectedChat(data.chats[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ================= CREATE NEW CHAT =================

  const createNewChat = async () => {
    try {
      if (!user) {
        toast.error("Login to create new chat");
        return navigate("/");
      }

      const { data } = await axios.get("/api/chat/create", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        await fetchUserChats();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ================= THEME =================

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // ================= TOKEN =================

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      fetchUser();
    } else {
      localStorage.removeItem("token");
      setUser(null);
      setChats([]);
      setSelectedChat(null);
      setLoadingUser(false);
    }
  }, [token]);

  // ================= USER =================

  useEffect(() => {
    if (user) {
      fetchUserChats();
    }
  }, [user]);

  // ================= CONTEXT VALUE =================

  const value = {
    navigate,

    user,
    setUser,

    chats,
    setChats,

    selectedChat,
    setSelectedChat,

    theme,
    setTheme,

    token,
    setToken,

    loadingUser,

    fetchUser,
    fetchUserChats,
    createNewChat,

    axios,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);