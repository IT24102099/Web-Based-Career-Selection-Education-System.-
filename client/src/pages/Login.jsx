import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, API_URL } from "../lib/api.js";
import { useAuth } from "../state/auth.jsx";

export default function Login() {
  const nav = useNavigate();
  const { setToken, setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      nav("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function googleAuth() {
    window.location.href = `${API_URL}/auth/google`;
  }

  return (
    <div className="card">
      <h2>Login</h2>
      <p className="small">Login with email/password or use Google authentication.</p>

      <div className="row" style={{marginTop: 14}}>
        <div className="col">
          <form onSubmit={onSubmit}>
            <label className="small">Email</label>
            <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="name@email.com" />
            <div style={{height: 10}} />
            <label className="small">Password</label>
            <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
            {error ? <div className="error">{error}</div> : null}
            <div style={{height: 12}} />
            <button className="btn" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
            <div style={{height: 10}} />
            <div className="small">No account? <Link to="/register"><u>Create one</u></Link></div>
          </form>
        </div>

        <div className="col">
          <div className="card" style={{background:"#fafafa"}}>
            <h3>Continue with Google</h3>
            <p className="small">Redirects to backend OAuth endpoint.</p>
            <button className="btn secondary" onClick={googleAuth}>Continue with Google</button>
          </div>
        </div>
      </div>
    </div>
  );
}
