import { Schema, model } from "mongoose";

const userSchema = new Schema({
  twitchId: { type: String, unique: true, required: true },
});

export const UserModel = model("User", userSchema);
