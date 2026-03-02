import express from "express";
import { getQuizQuestions, submitQuiz } from "../controllers/quizController.js";
import { requireAuth } from "../middleware/auth.js";
import { QuizQuestion } from "../models/QuizQuestion.js";

const router = express.Router();

router.get("/questions", requireAuth, getQuizQuestions);
router.post("/submit", requireAuth, submitQuiz);

// POST /api/quiz/questions (create)
router.post("/questions", requireAuth, async (req, res, next) => {
  try {
    const { questionText, options, correctOptionIndex, category, explanation } = req.body || {};
    if (!questionText) return res.status(400).json({ message: "questionText is required" });
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "options must be an array with at least 2 items" });
    }
    if (typeof correctOptionIndex !== "number" || correctOptionIndex < 0 || correctOptionIndex >= options.length) {
      return res.status(400).json({ message: "correctOptionIndex must be a valid index" });
    }

    const created = await QuizQuestion.create({
      questionText,
      options,
      correctOptionIndex,
      category,
      explanation
    });
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

export default router;

