import express from "express";
import { config } from "dotenv";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
config();
const app = express();

//middlewares
const allowedOrigins = [
  "http://localhost:5173",
  
  ...(process.env.CLIENT_ORIGIN?.split(",").map((origin) => origin.trim()).filter(Boolean) ?? []),
];

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
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
