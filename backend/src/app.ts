import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import projectRoutes from "./routes/project.routes.js";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// ⚠️ Vercel Serverless Fix: Connection Middleware
// Ye check karega ke har request hit hone par DB connect ho
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("❌ Database Connection Middleware Error:", error);
    res.status(500).json({ message: "Database connection failed" });
  }
});

// Routes Setup
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/projects", projectRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;