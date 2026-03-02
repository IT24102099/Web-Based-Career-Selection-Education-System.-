import mongoose from "mongoose";

const degreeProgramSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    faculty: { type: String },
    university: { type: mongoose.Schema.Types.ObjectId, ref: "University" }
  },
  { timestamps: true }
);

export const DegreeProgram = mongoose.model("DegreeProgram", degreeProgramSchema);

