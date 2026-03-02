import React, { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import ProgressBar from "../components/ProgressBar.jsx";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setError("");
      setLoading(true);
      try {
        const res = await api.get("/api/quiz/questions");
        setQuestions(res.data || []);
      } catch (e) {
        setError("Failed to load quiz questions.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleSelect(questionId, index) {
    setAnswers((prev) => ({ ...prev, [questionId]: index }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setResult(null);
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, selectedOptionIndex]) => ({
          questionId,
          selectedOptionIndex
        }))
      };
      const res = await api.post("/api/quiz/submit", payload);
      setResult(res.data);
    } catch (e) {
      setError("Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  }

  const total = questions.length;
  const answered = Object.keys(answers).length;

  return (
    <div className="card">
      <h2>Career Assessment Quiz</h2>
      <p className="small">Answer a few questions to understand your interests and strengths.</p>

      <div style={{ margin: "12px 0" }}>
        <ProgressBar value={answered} max={total || 1} />
        <div className="small" style={{ marginTop: 4 }}>
          {answered}/{total || 0} questions answered
        </div>
      </div>

      {loading && <p>Loading questions...</p>}
      {error && <div className="error">{error}</div>}

      {!loading && total === 0 && (
        <p className="small">No questions configured yet. Ask your backend team to seed questions.</p>
      )}

      {!loading && total > 0 && (
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {questions.map((q, idx) => (
              <div key={q._id} className="card" style={{ padding: 16, background: "#050816" }}>
                <div className="small" style={{ opacity: 0.8 }}>Question {idx + 1}</div>
                <p style={{ fontWeight: 500 }}>{q.questionText}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                  {q.options?.map((opt, optIdx) => (
                    <label key={optIdx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input
                        type="radio"
                        name={q._id}
                        value={optIdx}
                        checked={answers[q._id] === optIdx}
                        onChange={() => handleSelect(q._id, optIdx)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            <button className="btn" type="submit" disabled={submitting || total === 0}>
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          </div>
        </form>
      )}

      {result && (
        <div style={{ marginTop: 20 }} className="pill">
          Score: <strong>{result.score}</strong> / {result.totalQuestions}
        </div>
      )}
    </div>
  );
}

