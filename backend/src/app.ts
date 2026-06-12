import express from "express";
import { config } from "dotenv";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
config();
const app = express();

//middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost on any port during development
      if (!origin || origin.startsWith("https://mern-ai-chat-bot-x4iu.vercel.app" )) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.options("*", cors());
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