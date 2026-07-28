// src/models/task.model.ts
import { Schema, model } from "mongoose";
import { TASK_STATUS } from "../constants/status.js";

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    status: { type: String, enum: Object.values(TASK_STATUS), default: TASK_STATUS.TODO },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    assignee: { type: Schema.Types.ObjectId, ref: "User" },
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Task = model("Task", taskSchema);