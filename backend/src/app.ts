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

// 1. Mandatory for Vercel Serverless HTTPS Reverse Proxying
// Iske bina req.secure false rehta hai aur sameSite: "none" cookies block ho jati hain
app.set("trust proxy", 1);

// Allowed origins setup (Production Frontend + Localhost)
const allowedOrigins = [
  "https://mini-jira-iq5x.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
  ...(env.CORS_ORIGIN ? [env.CORS_ORIGIN] : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Vercel Serverless Fix: Database Connection Middleware
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