import React, { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import CareerCard from "../components/CareerCard.jsx";

export default function CareersList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    load(page);
  }, [page]);

  async function load(p) {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/careers", { params: { page: p, limit: 9 } });
      setItems(res.data.items || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (e) {
      setError("Failed to load careers.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!search.trim()) {
      setSearchResults(null);
      return;
    }
    setError("");
    try {
      const res = await api.get(`/api/careers/search/${encodeURIComponent(search.trim())}`);
      setSearchResults(res.data || []);
    } catch (e) {
      setError("Failed to search careers.");
    }
  }

  const list = searchResults ?? items;

  return (
    <div className="card">
      <h2>Career Path Explorer</h2>
      <p className="small">
        Browse possible careers and explore what each role involves.
      </p>

      <form onSubmit={handleSearch} style={{ margin: "12px 0", display: "flex", gap: 8 }}>
        <input
          placeholder="Search careers by title or field..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <button className="btn secondary" type="submit">Search</button>
      </form>

      {error && <div className="error">{error}</div>}
      {loading && <p>Loading careers...</p>}

      {!loading && list.length === 0 && (
        <p className="small">No careers found yet. Seed some careers in MongoDB to get started.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginTop: 12
        }}
      >
        {list.map((career) => (
          <CareerCard key={career._id} career={career} />
        ))}
      </div>

      {searchResults == null && totalPages > 1 && (
        <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center" }}>
          <button
            className="btn secondary"
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span className="small" style={{ alignSelf: "center" }}>
            Page {page} of {totalPages}
          </span>
          <button
            className="btn secondary"
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

