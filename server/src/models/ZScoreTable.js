import mongoose from "mongoose";

const zScoreTableSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    stream: { type: String, required: true },
    district: { type: String, required: true },
    degreeProgram: { type: mongoose.Schema.Types.ObjectId, ref: "DegreeProgram", required: true },
    minZScore: { type: Number, required: true }
  },
  { timestamps: true }
);

export const ZScoreTable = mongoose.model("ZScoreTable", zScoreTableSchema);

