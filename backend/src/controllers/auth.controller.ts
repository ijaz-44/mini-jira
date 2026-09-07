// src/controllers/auth.controller.ts
import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authService } from "../services/auth.service.js";
import { appError } from "../utils/appError.js";

const cookieOptions = {
  httpOnly: true,
  // signed: true,
  secure: false, // env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { user, tokens } = await authService.register(req.body);

  res.cookie("accessToken", tokens.accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 mins
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    success: true,
    data: user,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, tokens } = await authService.login(req.body);

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
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// 1. UPDATED: Fetch latest user state directly from DB instead of returning static decoded token
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getUserById(req.user!.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// 2. UPDATED: Sync both access and refresh cookies with new role credentials
export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.body;

  if (!role) {
    throw new appError("Role is required.", 400);
  }

  const validRole = role as "ADMIN" | "MANAGER" | "EMPLOYEE";

  const { user, tokens } = await authService.updateRole(
    req.user!.id,
    validRole
  );

  // Set updated Access Token cookie
  res.cookie("accessToken", tokens.accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  // Set updated Refresh Token cookie
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