import { useState, useEffect } from "react";
import ExpenseManager from "./components/ExpenseManager/ExpenseManager";
import MemberManager from "./components/MemberManager/MemberManager";
import GroupManager from "./components/GroupManager/GroupManager";
import AuthPage from "./components/Auth/AuthPage";
import "./App.css";

const TABS = ["Expenses", "Members & Balances"];

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [members, setMembers] = useState([]);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeGroupId, setActiveGroupId] = useState(null);

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
    if (!activeGroupId) return;
    try {
      const res = await fetch(`/api/members?tripId=${activeGroupId}`, {
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
    if (user && activeGroupId) {
      fetchMembers();
    }
  }, [user, activeGroupId]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setMembers([]);
    setActiveGroupId(null);
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
            {activeGroupId && (
              <button 
                className="back-btn" 
                onClick={() => setActiveGroupId(null)}
                style={{ marginRight: '1rem', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}
              >
                Back to Groups
              </button>
            )}
            <p className="app-subtitle">Group travel expense tracker</p>
            <div className="app-user-info">
              <span className="app-username">👤 {user.username} {user.role === 'admin' ? '(Admin)' : ''}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {!activeGroupId ? (
        <main className="app-main">
          <GroupManager onSelectGroup={setActiveGroupId} />
        </main>
      ) : (
        <>
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
              <ExpenseManager tripId={activeGroupId} members={members} />
            )}
            {activeTab === 1 && (
              <MemberManager
                tripId={activeGroupId}
                members={members}
                refreshMembers={fetchMembers}
              />
            )}
          </main>
        </>
      )}

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
