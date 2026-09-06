import { Router } from "express";
import { validate } from "../validator/auth.validation.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { authUser } from "../../middleware/auth.middleware.js";
import { configs } from "../config/config.js";
import passport from "passport";
import jwt from "jsonwebtoken";

import {
   getMe,
   googleCallback,
   loginUser,
   logoutAllUser,
   logoutUser,
   refreshToken,
   registerUser,
   resendVerificationEmail,
   verifyEmail,
} from "../controllers/auth.controller.js";

const authRouter = Router();

// Auth Routes
authRouter.post("/register", validate(registerSchema), registerUser);

authRouter.get("/verify-email", verifyEmail);

authRouter.post("/resend-verification-email", resendVerificationEmail);

authRouter.post("/login", validate(loginSchema), loginUser);

authRouter.post("/logout", logoutUser);

authRouter.post("/logout-all", logoutAllUser);

authRouter.get("/get-me", authUser, getMe);

// Refresh Token Route - to get a new access token using a refresh token
authRouter.get("/refresh-token", refreshToken);

// Google OAuth
// Route to initiate Google OAuth flow - basically redirects the user to Google's OAuth 2.0 consent screen
authRouter.get(
   "/google",
   passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
   }),
);

// Callback route that Google will redirect to after authenticating google account of user
authRouter.get(
   "/google/callback",
   passport.authenticate("google", {
      session: false,
      failureRedirect:
         configs.NODE_ENV === "development"
            ? `${configs.CORS_ORIGIN}/login`
            : "/login",
   }),
   googleCallback,
);

export default authRouter;
