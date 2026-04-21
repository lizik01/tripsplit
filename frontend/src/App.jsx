import { useState, useEffect } from "react";
import ExpenseManager from "./components/ExpenseManager/ExpenseManager";
import MemberManager from "./components/MemberManager/MemberManager";
import GroupManager from "./components/GroupManager/GroupManager";
import AuthPage from "./components/Auth/AuthPage";
import styles from "./App.module.css";

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

  if (authLoading) return <div className={styles["app-loading"]}>Loading…</div>;
  if (!user) return <AuthPage onLogin={setUser} />;

  return (
    <div className={styles.app}>
      <header className={styles["app-header"]}>
        <div className={styles["app-header-inner"]}>
          <div className={styles["app-brand"]}>
            <span className={styles["app-logo"]} aria-hidden="true">✈️</span>
            <h1 className={styles["app-title"]}>TripSplit</h1>
          </div>
          <div className={styles["app-header-right"]}>
            {activeGroupId && (
              <button 
                className={styles["back-btn"]} 
                onClick={() => setActiveGroupId(null)}
                style={{ marginRight: '1rem', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}
                aria-label="Back to your dashboard of groups"
              >
                Back to Groups
              </button>
            )}
            <p className={styles["app-subtitle"]}>Group travel expense tracker</p>
            <div className={styles["app-user-info"]}>
              <span className={styles["app-username"]}>👤 {user.username} {user.role === 'admin' ? '(Admin)' : ''}</span>
              <button 
                className={styles["logout-btn"]} 
                onClick={handleLogout}
                aria-label="Log out of TripSplit"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {!activeGroupId ? (
        <main className={styles["app-main"]}>
          <GroupManager onSelectGroup={setActiveGroupId} />
        </main>
      ) : (
        <section aria-label="Group Details">
          <nav className={styles["app-tabs"]} role="tablist" aria-label="Group Navigation">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === i}
                aria-controls={`panel-${i}`}
                id={`tab-${i}`}
                className={`${styles["tab-btn"]} ${activeTab === i ? styles.active : ""}`}
                onClick={() => setActiveTab(i)}
              >
                <span aria-hidden="true">{i === 0 ? "💸 " : "👥 "}</span>
                {tab}
              </button>
            ))}
          </nav>

          <main className={styles["app-main"]} id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
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
        </section>
      )}

      <footer className={styles["app-footer"]}>
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
