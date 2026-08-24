import mongoose from "mongoose";
import { configs } from "./config.js";

const connectToDB = async () => {
   try {
      await mongoose.connect(configs.MONGO_URI);
      console.log(`MongoDB database connected successfully! 🎉`);
   } catch (error) {
      console.error("MongoDB connection error", error);
      process.exit(1);
   }
};

export default connectToDB;