import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    email: { type: String },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    answers: [
      {
        question: { type: mongoose.Schema.Types.ObjectId, ref: "QuizQuestion" },
        selectedOptionIndex: { type: Number, required: true },
        correct: { type: Boolean, required: true }
      }
    ]
  },
  { timestamps: true }
);

export const QuizResult = mongoose.model("QuizResult", quizResultSchema);

