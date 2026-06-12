import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { configureGemini } from "../config/gemini-config.js";
type ChatMessage = { role: "user" | "assistant" | string; content?: string };

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user)
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    // grab chats of user
    const chats = user.chats.map(({ role, content }) => ({ role, content })) as ChatMessage[];
    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });

    // send all chats with new one to Gemini API
    const config = configureGemini();
    const model = config.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Format messages for Gemini - it expects an array of content objects
    const formattedChats = chats.map(chat => ({
      role: chat.role === "user" ? "user" : "model",
      parts: [{ text: chat.content ?? "" }]
    }));
    
    // get latest response
    const chatResponse = await model.generateContent({
      contents: formattedChats,
    });
    
    const responseText = chatResponse.response.text();
    user.chats.push({ role: "assistant", content: responseText });
    await user.save();
    return res.status(200).json({ chats: user.chats });
  } catch (error: any) {
     console.error("🔥 FULL GEMINI ERROR:", error);
  return res.status(500).json({
    message: "Something went wrong",
    error: error?.message,})
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error: any) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error?.message ?? String(error) });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    //@ts-ignore
    user.chats = [];
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error: any) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error?.message ?? String(error) });
  }
};