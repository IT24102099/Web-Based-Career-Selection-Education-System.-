import React from "react";

export default function ProgressBar({ value, max = 100 }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div style={{ width: "100%", background: "#151a30", borderRadius: 999, padding: 2 }}>
      <div
        style={{
          width: `${pct}%`,
          background: "linear-gradient(90deg, #4f46e5, #22c55e)",
          borderRadius: 999,
          height: 10,
          transition: "width 0.3s ease"
        }}
      />
    </div>
  );
}

