import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  wallet: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  items: {
    type: Number,
    default: 0,
  },
  refCode: {
    type: String,
    required: false,
  },
  isSkipped: {
    type: Boolean,
    default: false,
  },
  code: {
    type: String,
    required: true,
  },
  rewards: {
    type: Number,
    default: 0,
  },
  twitter: {
    type: Boolean,
    default: false,
  },
  discord: {
    type: Boolean,
    default: false,
  },
  conversations: [
    {
      id: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: false,
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export const ExtUser = mongoose.model("extUsers", UserSchema);
