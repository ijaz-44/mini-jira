// src/middleware/role.middleware.ts
import type { Request, Response, NextFunction } from "express";
import type { role } from "../constants/roles.js";
import { appError } from "../utils/appError.js";

export const authorize = (...allowedRoles: role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role as role)) {
      return next(new appError("Forbidden: You do not have permission for this resource.", 403));
    }
    next();
  };
};