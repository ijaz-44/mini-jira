// src/services/auth.service.ts
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { appError } from "../utils/appError.js";
import { generateTokens } from "../utils/jwt.js";

export class authService {
  static async register(data: any) {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new appError("Email already exists", 400);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await User.create({ ...data, password: hashedPassword });

    const tokens = generateTokens({ id: user._id.toString(), role: user.role, email: user.email });
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, tokens };
  }

  static async login(data: any) {
    const user = await User.findOne({ email: data.email }).select("+password");
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new appError("Invalid credentials", 401);
    }

    const tokens = generateTokens({ id: user._id.toString(), role: user.role, email: user.email });
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, tokens };
  }
}




