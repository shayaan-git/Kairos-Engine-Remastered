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

// new chat Pehle dikhana hai - Inside navBar
chatSchema.index({ user: 1, createdAt: -1 });   // Compound index: { user: 1, createdAt: -1 } Jo pehle user se sort karta hai, aur jahan user same hai wahan createdAt se sort karta hai. -1 matlab descending order (naya pehle, purana baad mein). Ye index isliye banaya hai taki jab user ke chats ko fetch karein to wo naya chat pehle aaye.

const chatModel = mongoose.model("chat", chatSchema);

export default chatModel;
