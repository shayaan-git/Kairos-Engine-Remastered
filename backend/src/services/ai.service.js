import { ChatGroq } from "@langchain/groq";
import { configs } from "../config/config.js";
import {
   AIMessage,
   HumanMessage,
   SystemMessage,
} from "@langchain/core/messages";

const groqModel = new ChatGroq({
   model: "openai/gpt-oss-120b",
   apiKey: configs.GROQ_API_KEY,
   temperature: 0.5,
});

export async function generateChatResponse(messages) {
   const chatMessages = messages.map((msg) => {
      if (msg.role === "user") {
         return new HumanMessage(msg.content);
      }
      if (msg.role === "ai") {
         return new AIMessage(msg.content);
      }
      throw new Error(`Unsupported message role: ${msg.role}`);
   });

   const response = await groqModel.invoke(chatMessages);

   return response.content;
}

export async function generateChatTitle(message) {
   const response = await groqModel.invoke([
      new SystemMessage(`You are a title generator. Given the start of a conversation, generate a short, descriptive title for it.
      Rules:
      - 3-6 words maximum
      - No quotation marks, periods, or trailing punctuation
      - Use sentence case (capitalize only the first word and proper nouns)
      - Capture the core topic or task, not generic phrasing like "Chat about..." or "Question regarding..."
      - Do not include the words "title" or "conversation"
      - Be specific rather than vague (e.g. "Fixing React useEffect loop" not "Coding help")
      - Output only the title text, nothing else — no explanation, no preamble`),
      new HumanMessage(
         `Generate a title for a conversation that begins with this message: ${message}`,
      ),
   ]);
   return response.content;
}
