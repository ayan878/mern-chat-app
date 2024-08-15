import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      // Changed to an array to accommodate multiple messages
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Ensure uniqueness of participant pairs
conversationSchema.index({ participants: 1 }, { unique: true });

export const Conversation = mongoose.model("Conversation", conversationSchema);
