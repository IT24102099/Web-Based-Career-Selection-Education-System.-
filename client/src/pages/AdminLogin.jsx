import React, { useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "../state/auth.jsx";

export default function AdminLogin() {
  const { setToken: setAppToken, setUser: setAppUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAdmin(null);
    setToken("");
    try {
      const res = await api.post("/api/admin/login", { email, password });
      setAdmin(res.data.admin);
      setToken(res.data.token);
      // Treat admin token as app auth so you can access create pages
      setAppToken(res.data.token);
      setAppUser({
        id: res.data.admin.id,
        name: res.data.admin.name,
        email: res.data.admin.email,
        role: res.data.admin.role
      });
    } catch (e) {
      setError(e.response?.data?.message || "Admin login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Admin Login</h2>
      <p className="small">
        This is a separate login for administrators to manage content and jobs.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
        <input
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login as Admin"}
        </button>
      </form>

      {error && <div className="error" style={{ marginTop: 10 }}>{error}</div>}

      {admin && (
        <div style={{ marginTop: 16 }}>
          <div className="pill small">
            Logged in as admin: <strong>{admin.name}</strong> ({admin.email})
          </div>
          <p className="small" style={{ marginTop: 8 }}>
            JWT token (use in tools like Postman to call protected admin APIs):
          </p>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#0b1020",
              color: "#e7e9ff",
              padding: 12,
              borderRadius: 10,
              fontSize: 12
            }}
          >
            {token}
          </pre>
        </div>
      )}
    </div>
  );
}

