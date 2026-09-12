// src/middleware/auth.middleware.ts
import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { appError } from "../utils/appError.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | null = null;

  // 1. First preference: Check Cookies
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  // 2. Fallback: Check Authorization Header (Bearer Token)
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization.trim();
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1] || null;
    }
  }

  // 3. Token missing verification
  if (!token) {
    return next(new appError("Authentication required. Token missing.", 401));
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded as any;
    next();
  } catch (error) {
    return next(new appError("Invalid or expired access token.", 401));
  }
};