import { useState, useEffect } from "react";
import ExpenseManager from "./components/ExpenseManager/ExpenseManager";
import MemberManager from "./components/MemberManager/MemberManager";
import "./App.css";

const TABS = ["Expenses", "Members & Balances"];

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [members, setMembers] = useState([]);
  const tripId = "trip_demo_2025";

  const fetchMembers = async () => {
    try {
      const res = await fetch(`/api/members?tripId=${tripId}`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (err) {
      console.error("Failed to fetch members:", err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [tripId]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand">
            <span className="app-logo">✈️</span>
            <h1 className="app-title">TripSplit</h1>
          </div>
          <p className="app-subtitle">Group travel expense tracker</p>
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
