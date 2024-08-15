import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      minlength: 1, // Ensures that the message is not an empty string
      maxlength: 1000, // Optional: Limit message length to 1000 characters
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Indexes for performance
messageSchema.index({ senderId: 1 });
messageSchema.index({ receiverId: 1 });

export const Message = mongoose.model("Message", messageSchema);
