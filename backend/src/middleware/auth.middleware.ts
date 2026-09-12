// src/middleware/auth.middleware.ts
import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { appError } from "../utils/appError.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Direct req.cookies se accessToken read karein
  // 2. Fallback check for Authorization: Bearer  header (Postman / mobile support)
  const token =
    req.cookies?.accessToken ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

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