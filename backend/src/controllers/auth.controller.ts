// src/controllers/auth.controller.ts
import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authService } from "../services/auth.service.js";
import { appError } from "../utils/appError.js";
import { env } from "../config/env.js";

// Check if environment is production OR deployed on HTTPS (Vercel)
const isProduction = env.NODE_ENV === "production";

// Cross-site cookies (Vercel deployments) mandatory settings
const getCookieOptions = (req: Request) => {
  // Agar request HTTPS se aayi hai ya NODE_ENV production hai to true
  const isSecure = isProduction || req.secure || req.headers["x-forwarded-proto"] === "https";

  return {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? ("none" as const) : ("lax" as const),
    path: "/",
  };
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { user, tokens } = await authService.register(req.body);
  const cookieOptions = getCookieOptions(req);

  res.cookie("accessToken", tokens.accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    data: user,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, tokens } = await authService.login(req.body);
  const cookieOptions = getCookieOptions(req);

  res.cookie("accessToken", tokens.accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new appError("Refresh token missing.", 401);
  }

  const tokens = await authService.refresh(token);
  const cookieOptions = getCookieOptions(req);

  res.cookie("accessToken", tokens.accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Access token refreshed successfully",
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const cookieOptions = getCookieOptions(req);

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw new appError("Unauthorized request.", 401);
  }

  const user = await authService.getUserById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.body;

  if (!role) {
    throw new appError("Role is required.", 400);
  }

  const validRole = role as "ADMIN" | "MANAGER" | "EMPLOYEE";

  if (!req.user?.id) {
    throw new appError("Unauthorized request.", 401);
  }

  const { user, tokens } = await authService.updateRole(
    req.user.id,
    validRole
  );
  const cookieOptions = getCookieOptions(req);

  res.cookie("accessToken", tokens.accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Role updated successfully",
    data: user,
  });
});