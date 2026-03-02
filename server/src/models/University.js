import mongoose from "mongoose";

const universitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    country: { type: String, default: "Sri Lanka" },
    city: { type: String }
  },
  { timestamps: true }
);

export const University = mongoose.model("University", universitySchema);

