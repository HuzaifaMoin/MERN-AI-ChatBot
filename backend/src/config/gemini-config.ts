import { GoogleGenerativeAI } from "@google/generative-ai";

export const configureGemini = () => {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
};