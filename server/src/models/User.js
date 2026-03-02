import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String }, // only for local accounts
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
