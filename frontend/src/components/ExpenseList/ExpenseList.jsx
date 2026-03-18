import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ExpenseItem from "../ExpenseItem/ExpenseItem";
import "./ExpenseList.css";

const CATEGORIES = ["All", "Food & Drink", "Transport", "Accommodation", "Activities", "Shopping", "Other"];

function ExpenseList({ tripId, onEdit, refreshTrigger }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, [tripId, refreshTrigger]);

  async function fetchExpenses() {
    setLoading(true);
    setError(null);
    try {
      const url = tripId
        ? `/api/expenses?tripId=${encodeURIComponent(tripId)}`
        : "/api/expenses";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load expenses");
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this expense?")) return;
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  const filtered = expenses.filter((e) => {
    const matchCategory =
      filterCategory === "All" || e.category === filterCategory;
    const matchSearch =
      !search ||
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.paidBy.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  if (loading) return <div className="expense-list-status">Loading expenses...</div>;
  if (error) return <div className="expense-list-status error">{error}</div>;

  return (
    <div className="expense-list-wrapper">
      <div className="expense-list-header">
        <div className="expense-list-summary">
          <h2 className="expense-list-title">Expenses</h2>
          <span className="expense-total">
            {filtered.length} items · <strong>${total.toFixed(2)}</strong> total
          </span>
        </div>

        <div className="expense-filters">
          <input
            type="text"
            className="filter-search"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="filter-categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-chip ${filterCategory === cat ? "active" : ""}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="expense-list-empty">
          {expenses.length === 0
            ? "No expenses yet. Add one above!"
            : "No expenses match your filters."}
        </div>
      ) : (
        <ul className="expense-list">
          {filtered.map((expense) => (
            <li key={expense._id} className="expense-list-item">
              <ExpenseItem
                expense={expense}
                onEdit={onEdit}
                onDelete={handleDelete}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

ExpenseList.propTypes = {
  tripId: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.number,
};

ExpenseList.defaultProps = {
  tripId: null,
  refreshTrigger: 0,
};

export default ExpenseList;
