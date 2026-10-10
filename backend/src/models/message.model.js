import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
   {
      chat: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "chat",
         required: true,
      },
      content: {
         type: String,
         required: true,
         trim: true,
      },
      role: {
         type: String,
         enum: ["user", "ai"],
         required: true,
      },
   },
   { timestamps: true },
);

// New message Last mein dikhana hai - in iFrame (context window)
messageSchema.index({ chat: 1, createdAt: 1 });
// createdAt field exist karane ke liye timeStamps must hai. For .sort() wo controller mein karte hain to iske liye bhi timeStamps ke bina nahi hopayga.
// And ye hai ek Compound index: { chat: 1, createdAt: 1 } Jo pehle chat se sort karta hai, aur jahan chat same hai wahan createdAt se sort karta hai.

const messageModel = mongoose.model("message", messageSchema);

export default messageModel;
