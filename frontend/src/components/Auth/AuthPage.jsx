import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./AuthPage.module.css";

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
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
        body: JSON.stringify(mode === "register" ? { username, password, role } : { username, password }),
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
    <main className={styles["auth-wrapper"]}>
      <section className={styles["auth-card"]} aria-labelledby="auth-heading">
        <div className={styles["auth-brand"]}>
          <span className={styles["auth-logo"]} aria-hidden="true">✈️</span>
          <h1 id="auth-heading">TripSplit</h1>
          <p>Group travel expense tracker</p>
        </div>

        <h2 className={styles["auth-title"]}>
          {mode === "login" ? "Welcome back" : "Create account"}
        </h2>

        <form className={styles["auth-form"]} onSubmit={handleSubmit}>
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

          {mode === "register" && (
            <>
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className={styles["role-select"]}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </>
          )}

          {message && (
            <p className={`${styles["auth-message"]} ${message.startsWith("✅") ? styles["success"] : styles["error"]}`} role="alert">
              {message}
            </p>
          )}

          <button className={styles["auth-submit"]} type="submit" disabled={loading}>
            {loading ? "Please wait…" : mode === "login" ? "Log In" : "Register"}
          </button>
        </form>

        <p className={styles["auth-switch-text"]}>
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          <button
            className={styles["auth-switch-btn"]}
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setMessage("");
            }}
          >
            {mode === "login" ? "Register" : "Log In"}
          </button>
        </p>
      </section>
    </main>
  );
}

AuthPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};
