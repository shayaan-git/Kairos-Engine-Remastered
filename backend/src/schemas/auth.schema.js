import { z } from "zod";
import validator from "validator";

export const registerSchema = z.object({
   username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters")
      .regex(
         /^[a-zA-Z0-9_]+$/,
         "Username can only contain letters, numbers and underscores",
      ),

   email: z
      .string()
      .trim()
      .email("Please provide a valid email address")
      .transform((email) => validator.normalizeEmail(email) ?? email),

   password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
         "Password must contain uppercase, lowercase and number",
      ),
});

export const loginSchema = z.object({
   email: z
      .string()
      .trim()
      .email("Please provide a valid email address")
      .transform((email) => validator.normalizeEmail(email) ?? email),

   password: z.string().min(1, "Password is required"),
});
