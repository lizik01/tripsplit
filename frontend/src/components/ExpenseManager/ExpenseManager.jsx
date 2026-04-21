import { useState } from "react";
import PropTypes from "prop-types";
import ExpenseForm from "../ExpenseForm/ExpenseForm";
import ExpenseList from "../ExpenseList/ExpenseList";
import styles from "./ExpenseManager.module.css";

function ExpenseManager({ tripId, members = [] }) {
  const [editingExpense, setEditingExpense] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [toast, setToast] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSubmit(formData) {
    const isEditing = Boolean(editingExpense);
    const url = isEditing
      ? `/api/expenses/${editingExpense._id}`
      : "/api/expenses";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, tripId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Request failed");
      }
      showToast(isEditing ? "Expense updated!" : "Expense added!");
      setEditingExpense(null);
      setRefreshTrigger((n) => n + 1);
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  function handleEdit(expense) {
    setEditingExpense(expense);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingExpense(null);
  }

  return (
    <article className={styles["expense-manager"]}>
      {toast && (
        <div className={`${styles.toast} ${styles[`toast-${toast.type}`]}`} role="alert">
          <span aria-hidden="true">{toast.type === "success" ? "✅" : "❌"}</span> {toast.msg}
        </div>
      )}
      <section className={styles["expense-manager-form"]} aria-label="Expense Form">
        <ExpenseForm
          members={members}
          onSubmit={handleSubmit}
          editingExpense={editingExpense}
          onCancelEdit={handleCancelEdit}
        />
      </section>
      <section className={styles["expense-manager-list"]} aria-label="Expenses List">
        <ExpenseList
          tripId={tripId}
          onEdit={handleEdit}
          refreshTrigger={refreshTrigger}
        />
      </section>
    </article>
  );
}

ExpenseManager.propTypes = {
  tripId: PropTypes.string.isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
};

export default ExpenseManager;
