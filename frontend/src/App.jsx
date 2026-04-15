import { useState, useEffect } from "react";
import ExpenseManager from "./components/ExpenseManager/ExpenseManager";
import MemberManager from "./components/MemberManager/MemberManager";
import AuthPage from "./components/Auth/AuthPage";
import "./App.css";

const TABS = ["Expenses", "Members & Balances"];

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [members, setMembers] = useState([]);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const tripId = "trip_tokyo_2024";

  // Check if already logged in (e.g. page refresh)
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch(`/api/members?tripId=${tripId}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (err) {
      console.error("Failed to fetch members:", err);
    }
  };

  useEffect(() => {
    if (user) fetchMembers();
  }, [user]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setMembers([]);
  };

  if (authLoading) return <div className="app-loading">Loading…</div>;
  if (!user) return <AuthPage onLogin={setUser} />;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand">
            <span className="app-logo">✈️</span>
            <h1 className="app-title">TripSplit</h1>
          </div>
          <div className="app-header-right">
            <p className="app-subtitle">Group travel expense tracker</p>
            <div className="app-user-info">
              <span className="app-username">👤 {user}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="app-tabs" role="tablist">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === i}
            className={`tab-btn ${activeTab === i ? "active" : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {i === 0 ? "💸 " : "👥 "}
            {tab}
          </button>
        ))}
      </nav>

      <main className="app-main">
        {activeTab === 0 && (
          <ExpenseManager tripId={tripId} members={members} />
        )}
        {activeTab === 1 && (
          <MemberManager
            tripId={tripId}
            members={members}
            refreshMembers={fetchMembers}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>
          CS5610 · Spring 2025 · Yazi Zhang &amp; Jianyu Qiu ·{" "}
          <a
            href="https://johnguerra.co/classes/webDevelopment_spring_2025/"
            target="_blank"
            rel="noreferrer"
          >
            Class Link
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
