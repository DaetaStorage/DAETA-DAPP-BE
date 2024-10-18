import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  plan: {
    type: String,
    default: "free",
  },
  disk: {
    type: String,
    required: false,
  },
  vaults: [
    {
      vault: {
        type: Schema.Types.ObjectId,
        ref: "vault",
      },
    },
  ],
  passcode: {
    type: String,
    required: false,
  },
  password: {
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

export const User = mongoose.model("users", UserSchema);
