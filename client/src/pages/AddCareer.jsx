import React, { useState } from "react";
import { api } from "../lib/api.js";

function splitCsv(input) {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AddCareer() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [skillsCsv, setSkillsCsv] = useState("");
  const [educationCsv, setEducationCsv] = useState("");
  const [slug, setSlug] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdId, setCreatedId] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setCreatedId("");
    if (!title.trim()) return setError("Title is required.");

    setLoading(true);
    try {
      const res = await api.post("/api/careers", {
        title: title.trim(),
        category: category.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        description: description.trim() || undefined,
        skills: skillsCsv.trim() ? splitCsv(skillsCsv) : undefined,
        educationPaths: educationCsv.trim() ? splitCsv(educationCsv) : undefined,
        slug: slug.trim() || undefined
      });
      setCreatedId(res.data?._id || "");
      setTitle("");
      setCategory("");
      setImageUrl("");
      setDescription("");
      setSkillsCsv("");
      setEducationCsv("");
      setSlug("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create career.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Add Career</h2>
      <p className="small">Create a new career entry for the Career Explorer.</p>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
        <label className="small">Title</label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label className="small">Category (optional)</label>
        <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} />

        <label className="small">Image URL (optional)</label>
        <input className="input" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

        <label className="small">Slug (optional)</label>
        <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. software-engineer" />

        <label className="small">Description (optional)</label>
        <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />

        <label className="small">Skills (comma-separated, optional)</label>
        <input className="input" value={skillsCsv} onChange={(e) => setSkillsCsv(e.target.value)} placeholder="Communication, Problem Solving, ..." />

        <label className="small">Education paths (comma-separated, optional)</label>
        <input className="input" value={educationCsv} onChange={(e) => setEducationCsv(e.target.value)} placeholder="A/L Maths, SE Degree, ..." />

        {error ? <div className="error">{error}</div> : null}
        {createdId ? <div className="pill">Created: <strong>{createdId}</strong></div> : null}

        <button className="btn" disabled={loading}>
          {loading ? "Creating..." : "Create Career"}
        </button>
      </form>
    </div>
  );
}

