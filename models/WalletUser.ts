import mongoose from "mongoose";

const Schema = mongoose.Schema;

const WalletUserSchema = new Schema({
  address: {
    type: String,
    required: true,
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

export const WalletUser = mongoose.model("wallet_users", WalletUserSchema);
