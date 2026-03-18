import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./ExpenseForm.css";

const CATEGORIES = [
  "Food & Drink",
  "Transport",
  "Accommodation",
  "Activities",
  "Shopping",
  "Other",
];

const EMPTY_FORM = {
  description: "",
  amount: "",
  paidBy: "",
  category: "Food & Drink",
  date: new Date().toISOString().split("T")[0],
};

function ExpenseForm({ members, onSubmit, editingExpense, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingExpense) {
      setForm({
        description: editingExpense.description,
        amount: String(editingExpense.amount),
        paidBy: editingExpense.paidBy,
        category: editingExpense.category || "Other",
        date: editingExpense.date
          ? new Date(editingExpense.date).toISOString().split("T")[0]
          : EMPTY_FORM.date,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editingExpense]);

  function validate() {
    const newErrors = {};
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0)
      newErrors.amount = "Enter a valid positive amount";
    if (!form.paidBy.trim()) newErrors.paidBy = "Paid by is required";
    return newErrors;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        ...form,
        amount: parseFloat(form.amount),
      });
      if (!editingExpense) setForm(EMPTY_FORM);
    } finally {
      setLoading(false);
    }
  }

  const isEditing = Boolean(editingExpense);

  return (
    <div className="expense-form-wrapper">
      <h2 className="expense-form-title">
        {isEditing ? "✏️ Edit Expense" : "➕ Add Expense"}
      </h2>
      <form className="expense-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder="e.g. Hotel night 1"
            value={form.description}
            onChange={handleChange}
            className={errors.description ? "input-error" : ""}
          />
          {errors.description && (
            <span className="error-msg">{errors.description}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Amount ($)</label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              className={errors.amount ? "input-error" : ""}
            />
            {errors.amount && (
              <span className="error-msg">{errors.amount}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="paidBy">Paid By</label>
            {members && members.length > 0 ? (
              <select
                id="paidBy"
                name="paidBy"
                value={form.paidBy}
                onChange={handleChange}
                className={errors.paidBy ? "input-error" : ""}
              >
                <option value="">Select member</option>
                {members.map((m) => (
                  <option key={m._id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id="paidBy"
                name="paidBy"
                type="text"
                placeholder="Who paid?"
                value={form.paidBy}
                onChange={handleChange}
                className={errors.paidBy ? "input-error" : ""}
              />
            )}
            {errors.paidBy && (
              <span className="error-msg">{errors.paidBy}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Save Changes" : "Add Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}

ExpenseForm.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  onSubmit: PropTypes.func.isRequired,
  editingExpense: PropTypes.shape({
    _id: PropTypes.string,
    description: PropTypes.string,
    amount: PropTypes.number,
    paidBy: PropTypes.string,
    category: PropTypes.string,
    date: PropTypes.string,
  }),
  onCancelEdit: PropTypes.func,
};

ExpenseForm.defaultProps = {
  members: [],
  editingExpense: null,
  onCancelEdit: () => {},
};

export default ExpenseForm;
