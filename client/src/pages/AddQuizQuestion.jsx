import React, { useState } from "react";
import { api } from "../lib/api.js";

export default function AddQuizQuestion() {
  const [questionText, setQuestionText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [category, setCategory] = useState("");
  const [explanation, setExplanation] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdId, setCreatedId] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setCreatedId("");

    const options = [optionA, optionB, optionC, optionD].map((s) => s.trim()).filter(Boolean);
    if (!questionText.trim()) return setError("Question text is required.");
    if (options.length < 2) return setError("Enter at least 2 options.");
    if (correctOptionIndex < 0 || correctOptionIndex >= options.length) {
      return setError("Correct option index is invalid for the provided options.");
    }

    setLoading(true);
    try {
      const res = await api.post("/api/quiz/questions", {
        questionText: questionText.trim(),
        options,
        correctOptionIndex,
        category: category.trim() || undefined,
        explanation: explanation.trim() || undefined
      });
      setCreatedId(res.data?._id || "");
      setQuestionText("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setCorrectOptionIndex(0);
      setCategory("");
      setExplanation("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create quiz question.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Add Quiz Question</h2>
      <p className="small">Create a new career assessment quiz question.</p>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
        <label className="small">Question</label>
        <input className="input" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />

        <label className="small">Options (A–D)</label>
        <input className="input" placeholder="Option A" value={optionA} onChange={(e) => setOptionA(e.target.value)} />
        <input className="input" placeholder="Option B" value={optionB} onChange={(e) => setOptionB(e.target.value)} />
        <input className="input" placeholder="Option C (optional)" value={optionC} onChange={(e) => setOptionC(e.target.value)} />
        <input className="input" placeholder="Option D (optional)" value={optionD} onChange={(e) => setOptionD(e.target.value)} />

        <label className="small">Correct option</label>
        <select className="input" value={correctOptionIndex} onChange={(e) => setCorrectOptionIndex(parseInt(e.target.value, 10))}>
          <option value={0}>A</option>
          <option value={1}>B</option>
          <option value={2}>C</option>
          <option value={3}>D</option>
        </select>

        <label className="small">Category (optional)</label>
        <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} />

        <label className="small">Explanation (optional)</label>
        <input className="input" value={explanation} onChange={(e) => setExplanation(e.target.value)} />

        {error ? <div className="error">{error}</div> : null}
        {createdId ? <div className="pill">Created: <strong>{createdId}</strong></div> : null}

        <button className="btn" disabled={loading}>
          {loading ? "Creating..." : "Create Question"}
        </button>
      </form>
    </div>
  );
}

