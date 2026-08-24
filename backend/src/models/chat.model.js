import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "user",
         required: true,
      },
      title: {
         type: String,
         default: "New Chat",
         trim: true,
      },
   },
   { timestamps: true },
);

chatSchema.index({ user: 1, createdAt: -1 });

const chatModel = mongoose.model("chat", chatSchema);

export default chatModel;
