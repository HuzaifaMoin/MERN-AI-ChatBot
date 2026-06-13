import { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

export const authCookieOptions: CookieOptions = {
  path: "/",
  httpOnly: true,
  signed: true,
  sameSite: true,
  secure: true,
};
