import React, { useEffect } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import OAuthSuccess from "./pages/OAuthSuccess.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Quiz from "./pages/Quiz.jsx";
import CareersList from "./pages/CareersList.jsx";
import AlternativePaths from "./pages/AlternativePaths.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AddQuizQuestion from "./pages/AddQuizQuestion.jsx";
import AddCareer from "./pages/AddCareer.jsx";
import AddAlternativePath from "./pages/AddAlternativePath.jsx";
import EligibilityCreate from "./pages/EligibilityCreate.jsx";
import EligibilityCheck from "./pages/EligibilityCheck.jsx";
import CreateHub from "./pages/CreateHub.jsx";
import { useAuth } from "./state/auth.jsx";
import { setAuthToken } from "./lib/api.js";

function Layout({ children }) {
  const { user, logout } = useAuth();
  return (
    <div className="container">
      <div className="nav">
        <Link to="/" className="pill"><strong>Career Guidance</strong></Link>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {user ? (
            <>
              <Link className="pill" to="/quiz">Quiz</Link>
              <Link className="pill" to="/careers">Careers</Link>
              <Link className="pill" to="/alternatives">Alternatives</Link>
              <Link className="pill" to="/eligibility">Eligibility</Link>
              <Link className="pill" to="/create">Create</Link>
              <span className="pill">Hi, {user.name}</span>
              <button className="btn secondary" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn secondary" to="/login">Login</Link>
              <Link className="btn" to="/register">Register</Link>
              <Link className="pill" to="/admin-login">Admin</Link>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { token } = useAuth();
  useEffect(() => setAuthToken(token), [token]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/quiz" element={<PrivateRoute><Quiz /></PrivateRoute>} />
        <Route path="/careers" element={<PrivateRoute><CareersList /></PrivateRoute>} />
        <Route path="/alternatives" element={<PrivateRoute><AlternativePaths /></PrivateRoute>} />
        <Route path="/eligibility" element={<PrivateRoute><EligibilityCheck /></PrivateRoute>} />

        <Route path="/create" element={<PrivateRoute><CreateHub /></PrivateRoute>} />
        <Route path="/create/quiz-question" element={<PrivateRoute><AddQuizQuestion /></PrivateRoute>} />
        <Route path="/create/career" element={<PrivateRoute><AddCareer /></PrivateRoute>} />
        <Route path="/create/alternative-path" element={<PrivateRoute><AddAlternativePath /></PrivateRoute>} />
        <Route path="/create/eligibility" element={<PrivateRoute><EligibilityCreate /></PrivateRoute>} />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}
