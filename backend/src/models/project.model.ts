// src/models/project.model.ts
import { Schema, model } from "mongoose";

const projectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
   // key: { type: String, required: true, uppercase: true, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Project = model("Project", projectSchema);

