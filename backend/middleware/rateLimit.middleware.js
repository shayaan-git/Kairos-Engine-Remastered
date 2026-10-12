import rateLimit from "express-rate-limit";

// Short-term: stops spamming / bursts
export const messageBurstLimiter = rateLimit({
   windowMs: 60 * 1000, // 1 minute
   limit: 5, // 5 messages per minute per user
   standardHeaders: "draft-7", // sends RateLimit headers
   legacyHeaders: false,
   // authUser runs first, so req.user.id always exists here
   keyGenerator: (req) => req.user.id,
   message: {
      success: false,
      message: "You're sending messages too fast. Please wait a minute.",
   },
});

// Long-term: caps your daily AI cost per user
export const messageDailyLimiter = rateLimit({
   windowMs: 24 * 60 * 60 * 1000, // 24 hours
   limit: 100,
   standardHeaders: "draft-7",
   legacyHeaders: false,
   keyGenerator: (req) => req.user.id,
   message: {
      success: false,
      message: "Daily message limit reached. Try again tomorrow.",
   },
});
