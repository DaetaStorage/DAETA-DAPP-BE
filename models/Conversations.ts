import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "extUsers",
    required: true,
  },
  conversation_id: {
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

export const Conversation = mongoose.model("conversations", ConversationSchema);
