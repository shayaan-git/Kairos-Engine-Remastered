import { ChatGroq } from "@langchain/groq";
import { configs } from "../config/config.js";

const model = new ChatGroq({
   model: "openai/gpt-oss-120b",
   apiKey: configs.GROQ_API_KEY,
   temperature: 0.5,
});

const response = await model.invoke("What is the capital of India?");
