// src/services/auth.service.ts
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { appError } from "../utils/appError.js";
import { generateTokens, verifyRefreshToken } from "../utils/jwt.js";

export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";

export class authService {
  static async register(data: any) {
    const existing = await User.findOne({ email: data.email });

    if (existing) {
      throw new appError("Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      ...data,
      password: hashedPassword,
    });

    const tokens = generateTokens({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tokens,
    };
  }

  static async login(data: any) {
    const user = await User.findOne({
      email: data.email,
    }).select("+password +refreshToken");

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new appError("Invalid credentials", 401);
    }

    const tokens = generateTokens({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tokens,
    };
  }

  // Direct DB Query for getMe controller (Fresh data on page refresh)
  static async getUserById(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new appError("User not found", 404);
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  // Update Role with Token Re-issuance & DB Sync
  static async updateRole(userId: string, role: UserRole | string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new appError("User not found", 404);
    }

    user.role = role as UserRole;

    const tokens = generateTokens({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tokens,
    };
  }

  static async refresh(refreshToken: string) {
    let decoded: any;

    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      throw new appError("Invalid or expired refresh token", 401);
    }

    // Explicitly select refreshToken from DB
    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
      throw new appError("Invalid refresh token", 401);
    }

    const tokens = generateTokens({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return tokens;
  }
}