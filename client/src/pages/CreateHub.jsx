import React from "react";
import { Link } from "react-router-dom";

export default function CreateHub() {
  return (
    <div className="card">
      <h2>Create / Add Data</h2>
      <p className="small">Choose what you want to create.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginTop: 12 }}>
        <Link className="card" to="/create/quiz-question" style={{ background: "#fafafa" }}>
          <h3 style={{ marginTop: 0 }}>Add Quiz Question</h3>
          <p className="small">Create assessment questions for the quiz.</p>
        </Link>

        <Link className="card" to="/create/career" style={{ background: "#fafafa" }}>
          <h3 style={{ marginTop: 0 }}>Add Career</h3>
          <p className="small">Add careers for the Career Explorer.</p>
        </Link>

        <Link className="card" to="/create/alternative-path" style={{ background: "#fafafa" }}>
          <h3 style={{ marginTop: 0 }}>Add Alternative Path</h3>
          <p className="small">Add pathways like diplomas/certificates.</p>
        </Link>

        <Link className="card" to="/create/eligibility" style={{ background: "#fafafa" }}>
          <h3 style={{ marginTop: 0 }}>Add Eligibility Data</h3>
          <p className="small">Universities, degree programs, and Z-score cutoffs.</p>
        </Link>
      </div>
    </div>
  );
}

