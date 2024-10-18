import mongoose from "mongoose";

const Schema = mongoose.Schema;

const VaultSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  passcode: {
    type: String,
    required: true,
  },
  files: [
    {
      name: {
        type: String,
        required: true,
      },
      origin: {
        type: String,
        required: true,
      },
      destination: {
        type: String,
        required: true,
      },
      size: {
        type: Number,
        required: true,
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  progress: {
    type: Number,
    required: false,
  },
  size: {
    type: Number,
    default: 1,
  },
  type: {
    type: String,
    required: false,
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

export const Vault = mongoose.model("vault", VaultSchema);
