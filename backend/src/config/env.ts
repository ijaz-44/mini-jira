import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  PORT: z.string().default("5000"),
  MONGO_URI: z.string().min(1, "MongoDB URI is required"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  COOKIE_SECRET: z.string().min(1, "COOKIE_SECRET is required"),
  JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
}

export const env = _env.success
  ? _env.data
  : (process.env as unknown as z.infer<typeof envSchema>);