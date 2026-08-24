import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
   {
      username: {
         type: String,
         required: [true, "Username is required"],
         unique: true,
         trim: true,
         minlength: [3, "Username must be at least 3 characters long"],
         maxlength: [30, "Username must not exceed 30 characters"],
      },
      email: {
         type: String,
         required: [true, "Email is required"],
         unique: true,
         trim: true,
         lowercase: true,
         match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email",
         ],
      },
      password: {
         type: String,
         required: [true, "Password is required"],
         minlength: [6, "Password must be at least 6 characters long"],
         select: false, // Exclude password from query results by default
      },
      verified: {
         type: Boolean,
         default: false,
      },
      emailVerificationTokenHash: {
         type: String,
         default: null,
      },
      emailVerificationTokenExpiry: {
         type: Date,
         default: null,
      },
      verificationEmailLastSentAt: {
         type: Date,
         default: null,
      },
   },
   { timestamps: true },
);

// Mongoose pre-save hook (middleware) and mongoose instance methods
userSchema.pre("save", async function () {
   if (!this.isModified("password")) return;
   this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (candidatePassword) {
   return bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model("user", userSchema);

export default userModel;

/**
 * ✅ return ke saath await mat likho (jab tak error handle nahi karna).
   await is only used when you want to wait for the promise to resolve before moving on, but in this case, we want to return the promise itself so that the caller can handle it (e.g., with .then() or await).
   await lagana sahi hai, jab tumhe result (true ya false) chahiye.
   Like here: fir login controller me:
   const isMatch = await user.comparePassword(password);
 */
