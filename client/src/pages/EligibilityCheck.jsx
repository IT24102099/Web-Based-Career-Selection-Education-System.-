import React, { useState } from "react";
import { api } from "../lib/api.js";

export default function EligibilityCheck() {
  const [year, setYear] = useState("2023");
  const [stream, setStream] = useState("Mathematics");
  const [district, setDistrict] = useState("Colombo");
  const [zScore, setZScore] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setData(null);

    const z = Number(zScore);
    if (Number.isNaN(z)) return setError("Z-score must be a number.");

    setLoading(true);
    try {
      const res = await api.post("/api/eligibility/check", {
        year: Number(year),
        stream: stream.trim(),
        district: district.trim(),
        zScore: z
      });
      setData(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Eligibility check failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>View Eligibility</h2>
      <p className="small">Enter your details to see eligible degree programs based on Z-score cutoffs.</p>

      <form onSubmit={onSubmit} className="row" style={{ marginTop: 12 }}>
        <div className="col">
          <label className="small">Year</label>
          <select className="input" value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
          </select>
        </div>
        <div className="col">
          <label className="small">Stream</label>
          <input className="input" value={stream} onChange={(e) => setStream(e.target.value)} />
        </div>
        <div className="col">
          <label className="small">District</label>
          <input className="input" value={district} onChange={(e) => setDistrict(e.target.value)} />
        </div>
        <div className="col">
          <label className="small">Z-Score</label>
          <input className="input" value={zScore} onChange={(e) => setZScore(e.target.value)} placeholder="e.g. 1.8500" />
        </div>
        <div className="col" style={{ display: "flex", alignItems: "flex-end" }}>
          <button className="btn" disabled={loading}>
            {loading ? "Checking..." : "Check Eligibility"}
          </button>
        </div>
      </form>

      {error ? <div className="error">{error}</div> : null}

      {data ? (
        <div style={{ marginTop: 14 }}>
          <div className="pill">
            Programs found: <strong>{data.count}</strong>
          </div>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {data.programs?.map((p) => (
              <div key={`${p.degreeProgram?.code}-${p.minZScore}`} className="card" style={{ background: "#fafafa" }}>
                <h3 style={{ marginTop: 0 }}>{p.degreeProgram?.name}</h3>
                <div className="small">Program code: {p.degreeProgram?.code}</div>
                <div className="small">Cutoff (min Z): <strong>{p.minZScore}</strong></div>
                <div className="small">Year: {p.year} | Stream: {p.stream} | District: {p.district}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

