import React, { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import PathCard from "../components/PathCard.jsx";

export default function AlternativePaths() {
  const [items, setItems] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load(type) {
    setLoading(true);
    setError("");
    try {
      const url = type ? `/api/alternatives/type/${encodeURIComponent(type)}` : "/api/alternatives";
      const res = await api.get(url);
      setItems(res.data || []);
    } catch (e) {
      setError("Failed to load alternative paths.");
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(e) {
    const value = e.target.value;
    setTypeFilter(value);
    load(value || undefined);
  }

  return (
    <div className="card">
      <h2>Alternative Pathway Recommender</h2>
      <p className="small">
        Explore diplomas, certificates, vocational training, and other alternatives to traditional degrees.
      </p>

      <div style={{ margin: "12px 0", display: "flex", gap: 8 }}>
        <select value={typeFilter} onChange={handleFilterChange}>
          <option value="">All types</option>
          <option value="diploma">Diploma</option>
          <option value="certificate">Certificate</option>
          <option value="online-course">Online Course</option>
          <option value="vocational">Vocational</option>
        </select>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <p>Loading alternative paths...</p>}

      {!loading && items.length === 0 && (
        <p className="small">No alternative paths defined yet. Seed some data in MongoDB.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginTop: 12
        }}
      >
        {items.map((p) => (
          <PathCard key={p._id} path={p} />
        ))}
      </div>
    </div>
  );
}

