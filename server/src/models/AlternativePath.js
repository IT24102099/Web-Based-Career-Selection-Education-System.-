import mongoose from "mongoose";

const alternativePathSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true }, // e.g., diploma, certificate, online-course, vocational
    description: { type: String },
    duration: { type: String },
    provider: { type: String },
    link: { type: String }
  },
  { timestamps: true }
);

export const AlternativePath = mongoose.model("AlternativePath", alternativePathSchema);

