import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String },
    location: { type: String },
    type: { type: String }, // full-time, part-time, internship, etc.
    description: { type: String },
    applyUrl: { type: String }
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);

