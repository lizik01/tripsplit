import PropTypes from "prop-types";
import styles from "./ExpenseItem.module.css";

const CATEGORY_ICONS = {
  "Food & Drink": "🍜",
  Transport: "🚌",
  Accommodation: "🏨",
  Activities: "🎡",
  Shopping: "🛍️",
  Other: "📌",
};

function ExpenseItem({ expense, onEdit, onDelete }) {
  const isPayment = expense.category === "Payment";
  const icon = isPayment ? "💸" : (CATEGORY_ICONS[expense.category] || "📌");
  const formattedDate = expense.date
    ? new Date(expense.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";
  const perPerson =
    expense.splitAmong && expense.splitAmong.length > 0
      ? (expense.amount / expense.splitAmong.length).toFixed(2)
      : null;

  return (
    <article className={styles["expense-item"]} aria-label={`Expense: ${expense.description} for $${expense.amount.toFixed(2)}`}>
      <div className={styles["expense-icon"]} aria-hidden="true">{icon}</div>

      <div className={styles["expense-main"]}>
        {isPayment ? (
          <h3 className={styles["expense-description"]}>
            Payment to {expense.splitAmong ? expense.splitAmong.join(", ") : "Unknown"}
          </h3>
        ) : (
          <h3 className={styles["expense-description"]}>{expense.description}</h3>
        )}

        <div className={styles["expense-meta"]}>
          <span className={styles["expense-paid-by"]}>Paid by {expense.paidBy}</span>
          {!isPayment && (
            <>
              <span className={styles["expense-dot"]} aria-hidden="true">·</span>
              <span className={styles["expense-category"]}>{expense.category}</span>
            </>
          )}
          {formattedDate && (
            <>
              <span className={styles["expense-dot"]} aria-hidden="true">·</span>
              <span className={styles["expense-date"]}>{formattedDate}</span>
            </>
          )}
        </div>
        {perPerson && !isPayment && (
          <p className={styles["expense-split"]} style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
            ${perPerson} / person <span aria-hidden="true">·</span> split among: <strong>{expense.splitAmong.join(", ")}</strong>
          </p>
        )}
      </div>

      <div className={styles["expense-right"]}>
        <span className={styles["expense-amount"]}>${expense.amount.toFixed(2)}</span>
        <div className={styles["expense-actions"]}>
          <button
            className={`${styles["action-btn"]} ${styles["edit-btn"]}`}
            onClick={() => onEdit(expense)}
            aria-label={`Edit expense: ${expense.description}`}
            title="Edit"
          >
            ✏️
          </button>
          <button
            className={`${styles["action-btn"]} ${styles["delete-btn"]}`}
            onClick={() => onDelete(expense._id)}
            aria-label={`Delete expense: ${expense.description}`}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </article>
  );
}

ExpenseItem.propTypes = {
  expense: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    paidBy: PropTypes.string.isRequired,
    category: PropTypes.string,
    date: PropTypes.string,
    splitAmong: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ExpenseItem;
