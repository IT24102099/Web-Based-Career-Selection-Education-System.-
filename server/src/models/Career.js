import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String },
    imageUrl: { type: String },
    category: { type: String },
    skills: [{ type: String }],
    educationPaths: [{ type: String }]
  },
  { timestamps: true }
);

export const Career = mongoose.model("Career", careerSchema);

