import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
   throw new Error("MONGO URI is not defined in the environment variables.");
}
if (!process.env.GOOGLE_CLIENT_ID) {
   throw new Error(
      "GOOGLE CLIENT ID is not defined in the environment variables",
   );
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
   throw new Error(
      "GOOGLE CLIENT SECRET is not defined in the environment variables",
   );
}
if (!process.env.GOOGLE_REFRESH_TOKEN) {
   throw new Error(
      "GOOGLE REFRESH TOKEN is not defined in the environment variables",
   );
}
if (!process.env.GOOGLE_USER) {
   throw new Error(
      "GOOGLE USER ID is not defined in the environment variables",
   );
}
if (!process.env.GROQ_API_KEY) {
   throw new Error("GROQ_API_KEY is not defined in the environment variables");
}

if (!process.env.JWT_EMAIL_VERIFY_SECRET) {
   throw new Error("JWT_EMAIL_VERIFY_SECRET is not defined in the environment variables");
}

if (!process.env.JWT_ACCESS_SECRET) {
   throw new Error(
      "JWT_ACCESS_SECRET is not defined in the environment variables",
   );
}

if (!process.env.JWT_REFRESH_SECRET) {
   throw new Error(
      "JWT_REFRESH_SECRET is not defined in the environment variables",
   );
}

export const configs = {
   MONGO_URI: process.env.MONGO_URI,
   GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
   GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
   GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
   GOOGLE_USER: process.env.GOOGLE_USER,
   CLIENT_URL: process.env.CLIENT_URL,
   NODE_ENV: process.env.NODE_ENV,
   CORS_ORIGIN: process.env.CORS_ORIGIN,
   GROQ_API_KEY: process.env.GROQ_API_KEY,

   JWT_SECRET: process.env.JWT_SECRET,
   JWT_EMAIL_VERIFY_SECRET: process.env.JWT_EMAIL_VERIFY_SECRET,
   JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
   JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
};
