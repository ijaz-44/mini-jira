// src/middleware/auth.middleware.ts
import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { appError } from "../utils/appError.js";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.signedCookies?.accessToken || req.cookies?.accessToken;

  if (!token) {
    return next(new appError("Authentication required. Token missing.", 401));
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(new appError("Invalid or expired access token.", 401));
  }
};