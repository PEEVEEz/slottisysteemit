import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  HOST: z.string().min(1),
  PORT: z.string().min(1),

  DATABASE_URL: z.string().min(1),
  DASHBOARD_URL: z.string().min(2),

  CLIENT_ID: z.string().min(1),
  CALLBACK_URL: z.string().min(1),
  CLIENT_SECRET: z.string().min(1),

  JWT_SECRET: z.string().min(1),
});

export const env = envSchema.parse(process.env);
