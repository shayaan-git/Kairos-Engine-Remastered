import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import cors from "cors";

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { configs } from "./config/config.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
   cors({
      origin: configs.CORS_ORIGIN || "http://localhost:5173",
      credentials: true,
      methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
   }),
);

// Google OAuth2.O passport flow
app.use(passport.initialize());

// Configuring passport to use Google OAuth2.O Strategy
passport.use(
   new GoogleStrategy(
      {
         clientID: configs.GOOGLE_CLIENT_ID,
         clientSecret: configs.GOOGLE_CLIENT_SECRET,
         callbackURL: "/api/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
         return done(null, profile); // profile = req.user
      },
   ),
);

// Health API
app.get("/", (req, res) => {
   res.status(200).json({
      message: "Backend is running healthy",
      status: "OK",
   });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

export default app;
