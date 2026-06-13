import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";
import { signedCookies } from "cookie-parser";

export const createToken = (id: string, email: string, expiresIn: string) => {
  const payload = { id, email };
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set in environment");

  const token = jwt.sign(payload, secret, {
    expiresIn,
  } as jwt.SignOptions);
  return token;
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.signedCookies?.[COOKIE_NAME];
  console.log("cookies:", req.cookies);
console.log("signedCookies:", req.signedCookies);

  if (!token) {
    return res.status(401).json({ message: "Token Not Received" });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ message: "JWT not configured" });
  }

  try {
    const data = jwt.verify(token, secret);
    res.locals.jwtData = data;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};