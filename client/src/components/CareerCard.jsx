import React from "react";

export default function CareerCard({ career, onClick }) {
  if (!career) return null;

  return (
    <div
      className="card"
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    >
      {career.imageUrl && (
        <img
          src={career.imageUrl}
          alt={career.title}
          style={{ width: "100%", borderRadius: 12, marginBottom: 10, maxHeight: 180, objectFit: "cover" }}
        />
      )}
      <h3>{career.title}</h3>
      {career.category && <div className="pill small">{career.category}</div>}
      {career.description && (
        <p className="small" style={{ marginTop: 8 }}>
          {career.description.length > 160
            ? career.description.slice(0, 160) + "..."
            : career.description}
        </p>
      )}
      {career.skills?.length ? (
        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {career.skills.slice(0, 4).map((s) => (
            <span key={s} className="pill small">{s}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

