import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    indexNumber: { type: String },
    district: { type: String },
    stream: { type: String },
    zScore: { type: Number }
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);

