
import { useState } from "react";
import "./AuthPage.css";

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const url =
      mode === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong.");
      } else if (mode === "register") {
        setMessage("✅ Registered! Please log in.");
        setMode("login");
        setUsername("");
        setPassword("");
      } else {
        onLogin(data.user);
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">✈️</span>
          <h1>TripSplit</h1>
          <p>Group travel expense tracker</p>
        </div>

        <h2 className="auth-title">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />

          {message && (
            <p className={`auth-message ${message.startsWith("✅") ? "success" : "error"}`}>
              {message}
            </p>
          )}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Please wait…" : mode === "login" ? "Log In" : "Register"}
          </button>
        </form>

        <p className="auth-switch-text">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          <button
            className="auth-switch-btn"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setMessage("");
            }}
          >
            {mode === "login" ? "Register" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
}
