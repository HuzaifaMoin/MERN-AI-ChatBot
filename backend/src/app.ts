import express from "express";
import { config } from "dotenv";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
config();
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://mern-ai-chat-bot-xmkd.vercel.app",
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGINS,
]
  .flatMap((origin) => origin?.split(",") ?? [])
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
};

//middlewares
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Enable pre-flight for all routes
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
