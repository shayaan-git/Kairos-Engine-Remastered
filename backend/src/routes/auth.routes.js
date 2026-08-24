import { Router } from "express";
import { validate } from "../validator/auth.validation.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { authUser } from "../../middleware/auth.middleware.js";
import { configs } from "../config/config.js";
import passport from "passport";
import jwt from "jsonwebtoken";

import {
   getMe,
   loginUser,
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

authRouter.get("/get-me", authUser, getMe);

// Refresh Token Route - to get a new access token using a refresh token
authRouter.get("/refresh-token", refreshToken);

// Google OAuth
// Route to initiate Google OAuth flow
authRouter.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback route that Google will redirect to after authentication
authRouter.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    // Generate a JWT for the authenticated user
    const token = jwt.sign({ id: req.user.id, displayName: req.user.displayName }, configs.JWT_SECRET, { expiresIn: '1h' });
    // Send the token to the client
    res.json({ token });
  }
);

export default authRouter;
