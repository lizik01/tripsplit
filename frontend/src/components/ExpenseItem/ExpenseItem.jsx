import PropTypes from "prop-types";
import "./ExpenseItem.css";

const CATEGORY_ICONS = {
  "Food & Drink": "🍜",
  Transport: "🚌",
  Accommodation: "🏨",
  Activities: "🎡",
  Shopping: "🛍️",
  Other: "📌",
};

function ExpenseItem({ expense, onEdit, onDelete }) {
  const icon = CATEGORY_ICONS[expense.category] || "📌";
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
    <div className="expense-item">
      <div className="expense-icon">{icon}</div>

      <div className="expense-main">
        <p className="expense-description">{expense.description}</p>
        <div className="expense-meta">
          <span className="expense-paid-by">Paid by {expense.paidBy}</span>
          <span className="expense-dot">·</span>
          <span className="expense-category">{expense.category}</span>
          {formattedDate && (
            <>
              <span className="expense-dot">·</span>
              <span className="expense-date">{formattedDate}</span>
            </>
          )}
        </div>
        {perPerson && (
          <p className="expense-split" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
            ${perPerson} / person · split among: <strong>{expense.splitAmong.join(", ")}</strong>
          </p>
        )}
      </div>

      <div className="expense-right">
        <span className="expense-amount">${expense.amount.toFixed(2)}</span>
        <div className="expense-actions">
          <button
            className="action-btn edit-btn"
            onClick={() => onEdit(expense)}
            aria-label="Edit expense"
            title="Edit"
          >
            ✏️
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => onDelete(expense._id)}
            aria-label="Delete expense"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
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
