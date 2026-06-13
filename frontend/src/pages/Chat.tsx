import { useEffect, useRef, useState } from "react";
import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
import { red } from "@mui/material/colors";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
} from "../helpers/api-communicator";
import toast from "react-hot-toast";
type Message = {
  role: "user" | "assistant";
  content: string;
};
const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async () => {
    if (auth?.isAuthLoading || !auth?.isLoggedIn || !auth.user || isSubmitting) {
      return;
    }

    const content = inputRef.current?.value as string;
    if (!content.trim()) return;
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);
    try {
      setIsSubmitting(true);
      const chatData = await sendChatRequest(content);
      setChatMessages([...chatData.chats]);
    } catch (error: any) {
      console.log(error);
      toast.error("Please sign in again");
      if (error?.response?.status === 401) {
        await auth?.logout();
        setChatMessages([]);
        navigate("/login", { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    } catch (error) {
      console.log(error);
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  };
  useEffect(() => {
    let isMounted = true;

    const loadChats = async () => {
      if (auth?.isAuthLoading) return;

      if (!auth?.isLoggedIn || !auth.user) {
        setChatMessages([]);
        navigate("/login", { replace: true });
        return;
      }

      try {
        toast.loading("Loading Chats", { id: "loadchats" });
        const data = await getUserChats();
        if (!isMounted) return;
        setChatMessages([...data.chats]);
        toast.success("Successfully loaded chats", { id: "loadchats" });
      } catch (err: any) {
        if (!isMounted) return;
        console.log(err);
        toast.error("Loading Failed", { id: "loadchats" });
        if (err?.response?.status === 401) {
          await auth?.logout();
          navigate("/login", { replace: true });
        }
      }
    };

    loadChats();

    return () => {
      isMounted = false;
      toast.dismiss("loadchats");
    };
  }, [auth?.isAuthLoading, auth?.isLoggedIn, auth?.user, auth?.logout, navigate]);

  useEffect(() => {
    if (!auth?.isAuthLoading && !auth?.isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [auth?.isAuthLoading, auth?.isLoggedIn, navigate]);

  if (auth?.isAuthLoading) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: { md: "flex", xs: "none", sm: "none" },
          flex: 0.2,
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "60vh",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}
          >
            {auth?.user?.name
              ?.split(" ")
              ?.map((n) => n?.[0])
              ?.join("")
              ?.toUpperCase() || "U"}          </Avatar>
          <Typography sx={{ mx: "auto", fontFamily: "work sans" }}>
            You are talking to a ChatBOT
          </Typography>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 4, p: 3 }}>
            You can ask some questions related to Knowledge, Business, Advices,
            Education, etc. But avoid sharing personal information
          </Typography>
          <Button
            onClick={handleDeleteChats}
            sx={{
              width: "200px",
              my: "auto",
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              ":hover": {
                bgcolor: red.A400,
              },
            }}
          >
            Clear Conversation
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: "column",
          px: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "40px",
            color: "white",
            mb: 2,
            mx: "auto",
            fontWeight: "600",
          }}
        >
          Model - Gemini 2.5 Flash
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            overflowX: "hidden",
            overflowY: "auto",
            scrollBehavior: "smooth",
          }}
        >
          {chatMessages.map((chat, index) => (
            //@ts-ignore
            <ChatItem content={chat.content} role={chat.role} key={index} />
          ))}
        </Box>
        <div
          style={{
            width: "100%",
            borderRadius: 8,
            backgroundColor: "rgb(17,27,39)",
            display: "flex",
            margin: "auto",
          }}
        >
          {" "}
          <input
            ref={inputRef}
            type="text"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: "30px",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "20px",
            }}
          />
          <IconButton
            disabled={isSubmitting || auth?.isAuthLoading || !auth?.isLoggedIn}
            onClick={handleSubmit}
            sx={{ color: "white", mx: 1 }}
          >
            <IoMdSend />
          </IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default Chat;
