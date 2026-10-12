import { Router } from "express";
import { deleteChat, getChats, getMessages, sendMessage } from "../controllers/chat.controller.js";
import { authUser } from "../../middleware/auth.middleware.js";
import { messageBurstLimiter, messageDailyLimiter } from "../../middleware/rateLimit.middleware.js";

const chatRouter = Router();

// send a message (add rate-limiting)
chatRouter.post("/message", authUser, messageBurstLimiter, messageDailyLimiter, sendMessage);

// read a chat’s messages
chatRouter.get("/:chatId/messages", authUser, getMessages);

// list chats
chatRouter.get("/", authUser, getChats);

// delete a chat
chatRouter.delete("/:chatId", authUser, deleteChat);

export default chatRouter;
