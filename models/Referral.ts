import mongoose from "mongoose";
import { refRewards } from "../config/constants";

const Schema = mongoose.Schema;

const RefferalSchema = new Schema({
  inviter: {
    type: Schema.Types.ObjectId,
    ref: "extUsers",
    required: true,
  },
  invitee: {
    type: Schema.Types.ObjectId,
    ref: "extUsers",
    required: true,
  },
  reward: {
    type: Number,
    default: refRewards,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export const Referral = mongoose.model("referral", RefferalSchema);
