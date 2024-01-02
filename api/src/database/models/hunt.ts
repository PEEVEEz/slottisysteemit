import { Schema, model } from "mongoose";

const huntSchema = new Schema({
  name: { type: String, required: true },
  start: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const HuntModel = model("Hunt", huntSchema);
