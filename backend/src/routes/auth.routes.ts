// src/routes/auth.routes.ts
import { Router } from "express";
import { login, logout, register, getMe, refresh, updateRole } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);
router.patch("/role", authenticate, updateRole);


export default router;




