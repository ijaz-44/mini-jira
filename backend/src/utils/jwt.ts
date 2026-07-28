// src/utils/jwt.ts
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { UserPayload } from "../types/express.js";

export const generateTokens = (payload: { id: string; role: string; email: string }) => {
  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
  });

  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): UserPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as UserPayload;
};

export const verifyRefreshToken = (token: string): UserPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as UserPayload;
};
