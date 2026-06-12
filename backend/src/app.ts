import express from "express";
import { config } from "dotenv";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
config();
const app = express();

//middlewares
app.use(cors({
  origin: [
  "https://mern-ai-chat-bot-hi5c.vercel.app",
  "localhost:5173",
],
credentials: true,
}) 
);
app.options("*", cors( {
  origin: [
    "https://mern-ai-chat-bot-hi5c.vercel.app",
    "localhost:5173",
  ],
  credentials: true,
})); // Enable pre-flight for all routes
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running", status: "ok" });
});

// Favicon route (suppress 404 errors)
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

app.use("/api/v1", appRouter);

export default app;
