import React from "react";

export default function PathCard({ path }) {
  if (!path) return null;

  return (
    <div className="card">
      <div className="pill small">{path.type}</div>
      <h3>{path.title}</h3>
      {path.provider && <p className="small">Provider: {path.provider}</p>}
      {path.duration && <p className="small">Duration: {path.duration}</p>}
      {path.description && (
        <p className="small" style={{ marginTop: 8 }}>
          {path.description}
        </p>
      )}
      {path.link && (
        <a
          href={path.link}
          target="_blank"
          rel="noreferrer"
          className="small"
          style={{ marginTop: 8, display: "inline-block", color: "#60a5fa" }}
        >
          View more details
        </a>
      )}
    </div>
  );
}

