// src/models/user.model.ts
import { Schema, model } from "mongoose";
import { ROLES } from "../constants/roles.js";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.EMPLOYEE },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

export const User = model("User", userSchema);



