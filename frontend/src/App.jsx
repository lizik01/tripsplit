import { useState } from "react";
import ExpenseManager from "./components/ExpenseManager/ExpenseManager";
import "./App.css";

// Jianyu will import MemberManager here
// import MemberManager from "./components/MemberManager/MemberManager";

const TABS = ["Expenses", "Members & Balances"];

function App() {
  const [activeTab, setActiveTab] = useState(0);
  // For demo purposes use a single trip; in a real app this comes from a trip selector
  const tripId = "trip_demo_2025";

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
        {activeTab === 0 && <ExpenseManager tripId={tripId} />}
        {activeTab === 1 && (
          <div className="placeholder-panel">
            <span className="placeholder-icon">👥</span>
            <p>Member &amp; Balance Manager</p>
            <small>Jianyu's section goes here</small>
          </div>
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
