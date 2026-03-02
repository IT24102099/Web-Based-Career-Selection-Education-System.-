import React, { useState } from "react";
import { api } from "../lib/api.js";

export default function AddAlternativePath() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("diploma");
  const [provider, setProvider] = useState("");
  const [duration, setDuration] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdId, setCreatedId] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setCreatedId("");
    if (!title.trim()) return setError("Title is required.");
    if (!type.trim()) return setError("Type is required.");

    setLoading(true);
    try {
      const res = await api.post("/api/alternatives", {
        title: title.trim(),
        type: type.trim(),
        provider: provider.trim() || undefined,
        duration: duration.trim() || undefined,
        link: link.trim() || undefined,
        description: description.trim() || undefined
      });
      setCreatedId(res.data?._id || "");
      setTitle("");
      setType("diploma");
      setProvider("");
      setDuration("");
      setLink("");
      setDescription("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create alternative path.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Add Alternative Path</h2>
      <p className="small">Create a new alternative pathway recommendation.</p>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
        <label className="small">Title</label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label className="small">Type</label>
        <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="diploma">Diploma</option>
          <option value="certificate">Certificate</option>
          <option value="online-course">Online Course</option>
          <option value="vocational">Vocational</option>
        </select>

        <label className="small">Provider (optional)</label>
        <input className="input" value={provider} onChange={(e) => setProvider(e.target.value)} />

        <label className="small">Duration (optional)</label>
        <input className="input" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 6 months" />

        <label className="small">Link (optional)</label>
        <input className="input" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />

        <label className="small">Description (optional)</label>
        <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />

        {error ? <div className="error">{error}</div> : null}
        {createdId ? <div className="pill">Created: <strong>{createdId}</strong></div> : null}

        <button className="btn" disabled={loading}>
          {loading ? "Creating..." : "Create Alternative Path"}
        </button>
      </form>
    </div>
  );
}

