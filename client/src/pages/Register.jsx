import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, API_URL } from "../lib/api.js";
import { useAuth } from "../state/auth.jsx";

export default function Register() {
  const nav = useNavigate();
  const { setToken, setUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      nav("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  function googleAuth() {
    window.location.href = `${API_URL}/auth/google`;
  }

  return (
    <div className="card">
      <h2>Create account</h2>
      <p className="small">Register with email/password or use Google authentication.</p>

      <div className="row" style={{marginTop: 14}}>
        <div className="col">
          <form onSubmit={onSubmit}>
            <label className="small">Name</label>
            <input className="input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name" />
            <div style={{height: 10}} />
            <label className="small">Email</label>
            <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="name@email.com" />
            <div style={{height: 10}} />
            <label className="small">Password</label>
            <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
            {error ? <div className="error">{error}</div> : null}
            <div style={{height: 12}} />
            <button className="btn" disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </button>
            <div style={{height: 10}} />
            <div className="small">Already have an account? <Link to="/login"><u>Login</u></Link></div>
          </form>
        </div>

        <div className="col">
          <div className="card" style={{background:"#fafafa"}}>
            <h3>Or continue with Google</h3>
            <p className="small">Uses backend OAuth flow (Passport + Google OAuth 2.0).</p>
            <button className="btn secondary" onClick={googleAuth}>Continue with Google</button>
            <p className="small" style={{marginTop: 10}}>
              Tip: Ensure Google OAuth redirect URI matches <code>/auth/google/callback</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
