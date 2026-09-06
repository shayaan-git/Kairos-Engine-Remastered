import { configs } from "../config/config.js";
import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
   registerUserHTMLTemplate,
   resendVerificationEmailHTMLTemplate,
   verifyEmailHTMLTemplate,
} from "../templates/template-urls.js";

export async function registerUser(req, res) {
   try {
      const { username, email, password } = req.body;

      const userExists = await userModel.findOne({
         $or: [{ email }, { username }],
      });

      if (userExists) {
         return res.status(409).json({
            message: "User already exists",
            success: false,
         });
      }

      const user = new userModel({
         username,
         email,
         password,
      });

      const emailVerificationToken = crypto.randomBytes(32).toString("hex");

      // Hash the token before saving to the database
      const emailVerificationTokenHash = crypto
         .createHash("sha256")
         .update(emailVerificationToken)
         .digest("hex");

      user.emailVerificationTokenHash = emailVerificationTokenHash;
      user.emailVerificationTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

      await user.save();

      const verificationUrl = `${configs.CLIENT_URL}/api/auth/verify-email?token=${emailVerificationToken}`;

      await sendEmail({
         to: email,
         subject: "Welcome to KairosPX! Verify Your Email",
         html: registerUserHTMLTemplate(username, verificationUrl),
      });

      res.status(201).json({
         message:
            "User registered successfully. Please check your email to verify your account.",
         success: true,
         user: {
            id: user._id,
            username: user.username,
            email: user.email,
         },
      });
   } catch (err) {
      console.error("Registration Error: ", err);
      res.status(500).json({
         message: "Server error",
         success: false,
      });
   }
}

export async function verifyEmail(req, res) {
   try {
      const { token } = req.query; // crypto se "emailVerificationToken" ko set kiya gya aur query mein "token" name se bheja

      if (!token) {
         return res.status(400).json({
            message: "Verification token is missing",
            success: false,
         });
      }

      const emailVerificationTokenHash = crypto
         .createHash("sha256")
         .update(token)
         .digest("hex");

      const user = await userModel.findOne({
         emailVerificationTokenHash: emailVerificationTokenHash,
         emailVerificationTokenExpiry: { $gt: Date.now() },
      });

      if (!user) {
         return res.status(404).json({
            message: "Invalid or expired verification token",
            success: false,
         });
      }

      if (user.verified) {
         return res.status(400).json({
            message: "Email is already verified",
            success: false,
         });
      }

      user.verified = true;

      user.emailVerificationTokenHash = null;
      user.emailVerificationTokenExpiry = null;

      await user.save();

      const LoginUrl = `${configs.CLIENT_URL}/api/auth/login`;

      return res.send(verifyEmailHTMLTemplate(LoginUrl));
   } catch (err) {
      console.error("Verification Failed:", err);

      return res.status(400).json({
         message: "Invalid or expired token",
         success: false,
      });
   }
}

export async function resendVerificationEmail(req, res) {
   try {
      const { email } = req.body;

      if (!email) {
         return res.status(400).json({
            message: "Email is required",
            success: false,
         });
      }

      const user = await userModel.findOne({ email });

      if (!user) {
         return res.status(200).json({
            message:
               "If an unverified account exists, a verification email has been sent.",
            success: true,
         });
      }

      if (user.verified) {
         return res.status(200).json({
            message: "Email is already verified",
            success: true,
         });
      }

      const COOLDOWN_MS = 60 * 1000;
      if (user.verificationEmailLastSentAt) {
         const timeSinceLastEmail =
            Date.now() - user.verificationEmailLastSentAt.getTime();

         if (timeSinceLastEmail < COOLDOWN_MS) {
            const remainingSeconds = Math.ceil(
               (COOLDOWN_MS - timeSinceLastEmail) / 1000,
            );

            return res.status(429).json({
               message: `Please wait ${remainingSeconds} seconds before requesting another verification email.`,
               success: false,
               retryAfter: remainingSeconds,
            });
         }
      }

      const emailVerificationToken = crypto.randomBytes(32).toString("hex");

      // Hash the new token before saving to the database
      const emailVerificationTokenHash = crypto
         .createHash("sha256")
         .update(emailVerificationToken)
         .digest("hex");

      const ReVerificationUrl = `${configs.CLIENT_URL}/api/auth/verify-email?token=${encodeURIComponent(emailVerificationToken)}`;

      // Replace old hash
      user.emailVerificationTokenHash = emailVerificationTokenHash;
      user.emailVerificationTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
      user.verificationEmailLastSentAt = new Date();

      // Save the updated user document with the new token and expiry
      await user.save();

      let userKaName = user.username;

      await sendEmail({
         to: user.email,
         subject: "Re-Verify Your KairosPX Email",
         html: resendVerificationEmailHTMLTemplate(
            userKaName,
            ReVerificationUrl,
         ),
      });

      return res.status(200).json({
         message:
            "If an unverified account exists, a verification email has been sent.",
         success: true,
      });
   } catch (err) {
      console.error("Resend Verification Email Error:", err);

      return res.status(500).json({
         message: "Failed to process Re-Verification email",
         success: false,
      });
   }
}

export async function loginUser(req, res) {
   try {
      const { email, password } = req.body;

      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
         return res.status(400).json({
            message: "Invalid email or password",
            success: false,
         });
      }

      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
         return res.status(400).json({
            message: "Invalid email or password",
            success: false,
         });
      }

      if (!user.verified) {
         return res.status(403).json({
            message: "Please verify your email before logging in",
            success: false,
         });
      }

      // RefreshToken Pehle create kara jata fir access token ko
      const refreshToken = jwt.sign(
         { id: user._id },
         configs.JWT_REFRESH_SECRET,
         {
            expiresIn: "7d",
         },
      );

      // Hash this refresh token before saving to database (session collection)
      const refreshTokenHash = crypto
         .createHash("sha256")
         .update(refreshToken)
         .digest("hex");

      const session = await sessionModel.create({
         user: user._id,
         refreshTokenHash,
         ip: req.ip,
         userAgent: req.headers["user-agent"],
      });

      // AccessToken
      const accessToken = jwt.sign(
         {
            id: user._id,
            username: user.username,
            sessionId: session._id,
         },
         configs.JWT_ACCESS_SECRET,
         {
            expiresIn: "15m",
         },
      );

      res.cookie("refreshToken", refreshToken, {
         httpOnly: true,
         secure: true,
         sameSite: "none",
         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
         message: "Login Successful",
         success: true,
         user: {
            id: user._id,
            username: user.username,
            email: user.email,
         },
         accessToken,
      });
   } catch (err) {
      console.error("Login Error: ", err);

      return res.status(500).json({
         message: "Server error",
         success: false,
      });
   }
}

export async function refreshToken(req, res) {
   try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
         return res.status(401).json({
            message: "No refresh token provided",
            success: false,
         });
      }

      const decoded = jwt.verify(refreshToken, configs.JWT_REFRESH_SECRET);

      const user = await userModel.findById(decoded.id);

      if (!user) {
         return res.status(401).json({
            message: "User no longer exists",
            success: false,
         });
      }

      if (!user.verified) {
         return res.status(403).json({
            message: "Email is not verified",
            success: false,
         });
      }

      const refreshTokenHash = crypto
         .createHash("sha256")
         .update(refreshToken)
         .digest("hex");

      const session = await sessionModel.findOne({
         refreshTokenHash,
         revoked: false,
      });

      if (!session) {
         return res.status(401).json({
            message: "Invalid Refresh Token",
         });
      }

      // Ab yahan access token again de rahe honge
      const accessToken = jwt.sign(
         { id: decoded.id },
         configs.JWT_ACCESS_SECRET,
         {
            expiresIn: "15m",
         },
      );

      const newRefreshToken = jwt.sign(
         { id: decoded.id },
         configs.JWT_REFRESH_SECRET,
         {
            expiresIn: "7d",
         },
      );

      const newRefreshTokenHash = crypto
         .createHash("sha256")
         .update(newRefreshToken)
         .digest("hex");

      session.refreshTokenHash = newRefreshTokenHash; // hash and save/update this new refresh token

      await session.save();

      res.cookie("refreshToken", newRefreshToken, {
         httpOnly: true,
         secure: true,
         sameSite: "none",
         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
         message: "Access token refreshed successfully",
         success: true,
         accessToken,
      });
   } catch (err) {
      return res.status(403).json({
         message: "Invalid refresh token",
         success: false,
      });
   }
}

export async function logoutUser(req, res) {
   const refreshToken = req.cookies.refreshToken;

   if (!refreshToken) {
      return res.status(400).json({
         message: "Refresh Token not found",
         success: false,
      });
   }

   //(Kyuki db mein hash format saved hai) Refresh Token ko hash karke fir query karenge - If matched - set Revoked: true
   const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

   const session = await sessionModel.findOneAndUpdate(
      { refreshTokenHash },
      { $set: { revoked: true } },
   );

   if (!session) {
      return res.status(400).json({
         message: "Invalid Refresh Token",
      });
   }

   await session.save();

   res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
   })
      .status(200)
      .json({
         message: "Logout Successful",
         success: true,
      });
}

export async function logoutAllUser(req, res) {
   const refreshToken = req.cookies.refreshToken;

   if (!refreshToken) {
      return res.status(400).json({
         message: "Refresh Token not found",
      });
   }

   const decoded = jwt.verify(refreshToken, configs.JWT_REFRESH_SECRET);

   await sessionModel.updateMany(
      {
         user: decoded.id,
         revoked: false,
      },
      {
         $set: { revoked: true },
      },
   );

   res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
   })
      .status(200)
      .json({
         message: "Logout from all devices Successful",
         success: true,
      });
}

export async function getMe(req, res) {
   try {
      const userId = req.user.id;

      const user = await userModel.findById(userId).select("-password");

      if (!user) {
         return res.status(404).json({
            message: "User not found",
            success: false,
         });
      }

      res.status(200).json({
         message: "User details fetched successfully",
         success: true,
         user: {
            username: user.username,
            email: user.email,
         },
      });
   } catch (err) {
      console.error("Get Me Error: ", err);
      return res.status(500).json({
         message: "Server error",
         success: false,
      });
   }
}

export const googleCallback = async (req, res) => {
   try {
      // const user = req.user;
      const { id, displayName, emails, photos } = req.user;

      const email = emails?.[0]?.value;
      const profilePic = photos?.[0]?.value;

      let user = await userModel.findOne({
         $or: [{ email }, { googleId: id }],
      });

      if (!user) {
         user = await userModel.create({
            email,
            googleId: id,
            fullname: displayName,
            profilePic,
         });
      }

      const refreshToken = jwt.sign(
         { id: user._id },
         configs.JWT_REFRESH_SECRET,
         { expiresIn: "7d" },
      );

      const refreshTokenHash = crypto
         .createHash("sha256")
         .update(refreshToken)
         .digest("hex");

      await sessionModel.create({
         user: user._id,
         refreshTokenHash,
         ip: req.ip,
         userAgent: req.headers["user-agent"],
      });

      res.cookie("refreshToken", refreshToken, {
         httpOnly: true,
         secure: true,
         sameSite: "none",
         maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const clientUrl = configs.NODE_ENV === "development"
         ? configs.CLIENT_URL
         : configs.CORS_ORIGIN;

      return res.redirect(`${clientUrl}`);
   } catch (err) {
      console.error("Google Callback Error:", err);

      configs.NODE_ENV === "development"
         ? configs.CLIENT_URL
         : configs.CORS_ORIGIN;
      return res.redirect(`${configs.CLIENT_URL}/login`);
   }
};
