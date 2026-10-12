import {
   generateChatResponse,
   generateChatTitle,
} from "../services/ai.service.js";

import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

// Rate-Limiting to add
export async function sendMessage(req, res) {
   try {
      // Getting the message and ChatId from the req.body
      const { message } = req.body;
      const chatId = req.body.chat;
      //OR => const {message, chat: chatId} = req.body

      // At first the title and chat are null
      let title = null;
      let chat = null;
      let activeChatId = chatId;

      // If chatId is not provided in the req.body -> then generate a title by giving that message (coming from req.body) to AI.
      if (!chatId) {
         title = await generateChatTitle(message);
         // Then store that title (and user id coming from auth.middleware) to db (chatModel) so chatId is created.
         chat = await chatModel.create({
            user: req.user.id,
            title,
         });
         activeChatId = chat._id;
      } else {
         const existing = await chatModel.findOne({
            _id: chatId,
            user: req.user.id,
         });
         if (!existing)
            return res.status(404).json({ message: "Chat not found" });
      }

      // Creating a user message and storing to db (messageModel) based on chatId or activeChatId
      const userMessage = await messageModel.create({
         chat: activeChatId, //chatId req.body se mili to theek warna new chatId use hoga from chatModel.
         content: message,
         role: "user", //Here, set ROLE = "user"
      });

      // NOTE: --> Kyunki LLM ke paas koi memory nahi hoti. Har API call bilkul fresh hoti hai. Model ko sirf wahi pata hota hai jo tum us ek call mein bhejte ho fir AI ko poora context milta hai, aur wo sahi jawab deta hai. Isiliye userMessage directly nahi bhejte generateChatResponse() mein. Also userMessage ek single Obj hai na ki array to wo bhi ek reason hai .map function lagte hi error aata.

      // Therefore, Finding all messages (HISTORY) from db (messageModel) and will be given to AI. (...will need to be optimized in future for large dataset of documents i.e. messages collection, by setting limit(n) and sort(createdAt: -1) with messages.reverse() --> For managing context window and token cost)
      const messages = await messageModel
         .find({ chat: activeChatId })
         .sort({ createdAt: 1 }); // 1 matlab ascending (purana msg pehle, naya msg baad mein), AI ko conversation isi order mein chahiye, kyunki baat-cheet purane se naye ki taraf chalti hai.

      // Giving that message(s) with HISTORY to AI
      const result = await generateChatResponse(messages);

      // Creating and Storing that AI message response in db (messageModel).
      const aiMessage = await messageModel.create({
         chat: activeChatId,
         content: result,
         role: "ai", // Here, set ROLE = "ai"
      });

      // For Sending/Showing these response in Frontend
      res.status(201).json({ title, chat, chatId: activeChatId, aiMessage });
   } catch (err) {
      console.error("Something went wrong in chat Controller", err);
      res.status(500).json({
         success: false,
         message: "Failed to send message",
      });
   }
}

// Get all messages of a particular chat
export async function getMessages(req, res) {
   const { chatId } = req.params;

   const chat = await chatModel.findOne({
      user: req.user.id,
      _id: chatId,
   });

   if (!chat) {
      return res.status(404).json({ message: "Chat not Found" });
   }

   const showAllChatMessages = await messageModel.find({
      chat: chatId,
   });

   return res.status(200).json({
      message: "Messages Retrieved Successfully",
      showAllChatMessages,
   });
}

export async function getChats(req, res) {
   const user = req.user;
   const chats = await chatModel.findOne({ user: user.id });
   res.status(200).json({
      message: "Chat retrieved successfully",
      chats,
   });
}

export async function deleteChat(req, res) {
   const { chatId } = req.params;

   const chat = await chatModel.findOneAndDelete({
      _id: chatId,
      user: req.user.id,
   });

   if (!chat) {
      return res.status(404).json({
         message: "Chat not found",
      });
   }

   // chats delete ho rahi to messages bhi rakhne ka matlab nahi so message bhi delete karenge
   await messageModel.deleteMany({ chat: chatId });

   return res.status(200).json({ message: "Chat deleted successfully" });
}
