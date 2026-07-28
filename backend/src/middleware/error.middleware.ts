// src/middleware/error.middleware.ts
import type { Request, Response, NextFunction } from "express";
import { appError } from "../utils/appError.js";
import { ZodError } from "zod";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};