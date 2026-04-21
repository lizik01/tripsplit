import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ExpenseItem from "../ExpenseItem/ExpenseItem";
import styles from "./ExpenseList.module.css";

// Categories derived dynamically from data

function ExpenseList({ tripId = null, onEdit, refreshTrigger = 0 }) {
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

  const dynamicCategories = ["All", ...new Set(expenses.map(e => e.category))];
  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  if (loading) return <div className={styles["expense-list-status"]} aria-live="polite">Loading expenses...</div>;
  if (error) return <div className={`${styles["expense-list-status"]} ${styles["error"]}`} role="alert">{error}</div>;

  return (
    <div className={styles["expense-list-wrapper"]}>
      <header className={styles["expense-list-header"]}>
        <div className={styles["expense-list-summary"]}>
          <h2 className={styles["expense-list-title"]}>Expenses</h2>
          <span className={styles["expense-total"]}>
            {filtered.length} items · <strong>${total.toFixed(2)}</strong> total
          </span>
        </div>

        <div className={styles["expense-filters"]}>
          <input
            type="text"
            className={styles["filter-search"]}
            placeholder="Search expenses..."
            aria-label="Search expenses"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <fieldset className={styles["filter-categories"]} style={{ border: "none", padding: 0, margin: 0 }}>
            <legend className="visually-hidden" style={{ display: 'none' }}>Filter by category</legend>
            {dynamicCategories.map((cat) => (
              <button
                key={cat}
                className={`${styles["filter-chip"]} ${filterCategory === cat ? styles.active : ""}`}
                onClick={() => setFilterCategory(cat)}
                aria-pressed={filterCategory === cat}
              >
                {cat}
              </button>
            ))}
          </fieldset>
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className={styles["expense-list-empty"]}>
          {expenses.length === 0
            ? "No expenses yet. Add one above!"
            : "No expenses match your filters."}
        </div>
      ) : (
        <ul className={styles["expense-list"]}>
          {filtered.map((expense) => (
            <li key={expense._id} className={styles["expense-list-item"]}>
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

export default ExpenseList;
