import React, { useState } from "react";
import { api } from "../lib/api.js";

export default function EligibilityCreate() {
  const [uName, setUName] = useState("");
  const [uCode, setUCode] = useState("");
  const [uCity, setUCity] = useState("");

  const [pName, setPName] = useState("");
  const [pCode, setPCode] = useState("");
  const [pFaculty, setPFaculty] = useState("");
  const [pUniversityCode, setPUniversityCode] = useState("");

  const [zYear, setZYear] = useState("2023");
  const [zStream, setZStream] = useState("Mathematics");
  const [zDistrict, setZDistrict] = useState("Colombo");
  const [zProgramCode, setZProgramCode] = useState("");
  const [zMin, setZMin] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function createUniversity(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!uName.trim() || !uCode.trim()) return setError("University name and code are required.");

    setLoading(true);
    try {
      const res = await api.post("/api/eligibility/universities", {
        name: uName.trim(),
        code: uCode.trim(),
        city: uCity.trim() || undefined
      });
      setSuccess(`University created: ${res.data.code}`);
      setUName("");
      setUCode("");
      setUCity("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create university.");
    } finally {
      setLoading(false);
    }
  }

  async function createProgram(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!pName.trim() || !pCode.trim()) return setError("Program name and code are required.");

    setLoading(true);
    try {
      const res = await api.post("/api/eligibility/degree-programs", {
        name: pName.trim(),
        code: pCode.trim(),
        faculty: pFaculty.trim() || undefined,
        universityCode: pUniversityCode.trim() || undefined
      });
      setSuccess(`Degree program created: ${res.data.code}`);
      setPName("");
      setPCode("");
      setPFaculty("");
      setPUniversityCode("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create degree program.");
    } finally {
      setLoading(false);
    }
  }

  async function createZScore(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const min = Number(zMin);
    if (!zProgramCode.trim()) return setError("Degree program code is required.");
    if (Number.isNaN(min)) return setError("Min Z-score must be a number.");

    setLoading(true);
    try {
      await api.post("/api/eligibility/z-scores", {
        year: Number(zYear),
        stream: zStream.trim(),
        district: zDistrict.trim(),
        degreeProgramCode: zProgramCode.trim(),
        minZScore: min
      });
      setSuccess("Z-score cutoff row created.");
      setZProgramCode("");
      setZMin("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create Z-score cutoff row.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Create Eligibility Data</h2>
      <p className="small">Add universities, degree programs, and Z-score cutoff rows for eligibility checking.</p>

      {error ? <div className="error">{error}</div> : null}
      {success ? <div className="pill">{success}</div> : null}

      <div className="row" style={{ marginTop: 12 }}>
        <div className="col">
          <div className="card" style={{ background: "#fafafa" }}>
            <h3>Create University</h3>
            <form onSubmit={createUniversity} style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
              <input className="input" placeholder="University name" value={uName} onChange={(e) => setUName(e.target.value)} />
              <input className="input" placeholder="University code (unique)" value={uCode} onChange={(e) => setUCode(e.target.value)} />
              <input className="input" placeholder="City (optional)" value={uCity} onChange={(e) => setUCity(e.target.value)} />
              <button className="btn" disabled={loading}>{loading ? "Saving..." : "Create University"}</button>
            </form>
          </div>
        </div>

        <div className="col">
          <div className="card" style={{ background: "#fafafa" }}>
            <h3>Create Degree Program</h3>
            <form onSubmit={createProgram} style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
              <input className="input" placeholder="Program name" value={pName} onChange={(e) => setPName(e.target.value)} />
              <input className="input" placeholder="Program code (unique)" value={pCode} onChange={(e) => setPCode(e.target.value)} />
              <input className="input" placeholder="Faculty (optional)" value={pFaculty} onChange={(e) => setPFaculty(e.target.value)} />
              <input className="input" placeholder="University code (optional)" value={pUniversityCode} onChange={(e) => setPUniversityCode(e.target.value)} />
              <button className="btn" disabled={loading}>{loading ? "Saving..." : "Create Program"}</button>
            </form>
          </div>
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div className="card" style={{ background: "#fafafa" }}>
        <h3>Create Z-Score Cutoff Row</h3>
        <form onSubmit={createZScore} className="row" style={{ marginTop: 10 }}>
          <div className="col">
            <label className="small">Year</label>
            <select className="input" value={zYear} onChange={(e) => setZYear(e.target.value)}>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div className="col">
            <label className="small">Stream</label>
            <input className="input" value={zStream} onChange={(e) => setZStream(e.target.value)} />
          </div>
          <div className="col">
            <label className="small">District</label>
            <input className="input" value={zDistrict} onChange={(e) => setZDistrict(e.target.value)} />
          </div>
          <div className="col">
            <label className="small">Degree Program Code</label>
            <input className="input" value={zProgramCode} onChange={(e) => setZProgramCode(e.target.value)} placeholder="e.g. SE001" />
          </div>
          <div className="col">
            <label className="small">Min Z-Score</label>
            <input className="input" value={zMin} onChange={(e) => setZMin(e.target.value)} placeholder="e.g. 1.8500" />
          </div>
          <div className="col" style={{ display: "flex", alignItems: "flex-end" }}>
            <button className="btn" disabled={loading}>{loading ? "Saving..." : "Create Z-Score Row"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

