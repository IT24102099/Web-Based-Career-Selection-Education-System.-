import React, { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "../state/auth.jsx";

export default function Dashboard() {
  const { token, user } = useAuth();
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setError("");
      try {
        const res = await api.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } });
        setMe(res.data);
      } catch (e) {
        setError("Failed to load profile. Check your token and server.");
      }
    }
    load();
  }, [token]);

  return (
    <div className="card">
      <h2>Dashboard</h2>
      <p className="small">You are authenticated. This is a placeholder page for your career guidance system.</p>

      <div style={{height: 12}} />
      <div className="pill">Token present: <strong>{token ? "Yes" : "No"}</strong></div>
      <div style={{height: 10}} />
      <div className="pill">Client user: <strong>{user?.email || "—"}</strong></div>

      <div style={{height: 16}} />
      <h3>Server /auth/me</h3>
      {error ? <div className="error">{error}</div> : null}
      <pre style={{whiteSpace:"pre-wrap", background:"#0b1020", color:"#e7e9ff", padding:14, borderRadius:12}}>
{me ? JSON.stringify(me, null, 2) : "Loading..."}
      </pre>

      <p className="small">
        Next steps: add modules like Assessment, Eligibility Analyzer, Career Explorer, Admin panel, etc.
      </p>
    </div>
  );
}
