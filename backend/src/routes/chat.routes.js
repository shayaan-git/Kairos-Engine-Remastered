import { Router } from "express";
import { deleteChat, getChats, getMessages, sendMessage } from "../controllers/chat.controller.js";
import { authUser } from "../../middleware/auth.middleware.js";

const chatRouter = Router();

chatRouter.post("/message", authUser, sendMessage);

chatRouter.get("/:chatId/messages", authUser, getMessages);

chatRouter.get("/", authUser, getChats);

chatRouter.delete("/delete/:chatId", authUser, deleteChat);

export default chatRouter;
