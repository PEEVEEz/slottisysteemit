import { Schema, model } from "mongoose";

const bonusSchema = new Schema({
  game: { type: String, required: true },
  bet: { type: Number, required: true },
  payout: { type: String },
  huntId: { type: Schema.Types.ObjectId, ref: "Hunt", required: true },
});

export const BonusModel = model("Bonus", bonusSchema);
