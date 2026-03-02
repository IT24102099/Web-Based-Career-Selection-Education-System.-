import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctOptionIndex: { type: Number, required: true },
    category: { type: String },
    explanation: { type: String }
  },
  { timestamps: true }
);

export const QuizQuestion = mongoose.model("QuizQuestion", quizQuestionSchema);

