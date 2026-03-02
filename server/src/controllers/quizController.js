import { QuizQuestion } from "../models/QuizQuestion.js";
import { QuizResult } from "../models/QuizResult.js";

export async function getQuizQuestions(req, res, next) {
  try {
    const questions = await QuizQuestion.find().lean();
    res.json(questions);
  } catch (e) {
    next(e);
  }
}

export async function submitQuiz(req, res, next) {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "answers array is required" });
    }

    const questionIds = answers.map((a) => a.questionId);
    const questions = await QuizQuestion.find({ _id: { $in: questionIds } }).lean();
    const questionsById = new Map(questions.map((q) => [q._id.toString(), q]));

    let score = 0;
    const detailedAnswers = [];

    for (const answer of answers) {
      const q = questionsById.get(answer.questionId);
      if (!q) continue;
      const correct = q.correctOptionIndex === answer.selectedOptionIndex;
      if (correct) score += 1;
      detailedAnswers.push({
        question: q._id,
        selectedOptionIndex: answer.selectedOptionIndex,
        correct
      });
    }

    const totalQuestions = questions.length;

    const result = await QuizResult.create({
      userId: req.user?.sub,
      email: req.user?.email,
      score,
      totalQuestions,
      answers: detailedAnswers
    });

    res.status(201).json({
      id: result._id,
      score,
      totalQuestions
    });
  } catch (e) {
    next(e);
  }
}

