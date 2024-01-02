import mongoose from "mongoose";
import { env } from "../lib/env";

export * from "./models/bonus";
export * from "./models/user";
export * from "./models/hunt";

export function connectDatabase() {
  mongoose
    .set("strictQuery", false)
    .connect(env.DATABASE_URL)
    .then(() => console.log("[MONGODB] Connected"));
}
