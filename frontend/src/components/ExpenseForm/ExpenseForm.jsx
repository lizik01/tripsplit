import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./ExpenseForm.module.css";

const CATEGORIES = [
  "Food & Drink",
  "Transport",
  "Accommodation",
  "Activities",
  "Shopping",
  "Other",
  "Custom",
];

const EMPTY_FORM = {
  description: "",
  amount: "",
  paidBy: "",
  category: "Food & Drink",
  date: new Date().toISOString().split("T")[0],
  splitAmong: [],
  receiver: "", // for payments
};

function ExpenseForm({ members = [], onSubmit, editingExpense = null, onCancelEdit = () => {} }) {
  const [mode, setMode] = useState("expense"); // "expense" | "payment"
  const [form, setForm] = useState(EMPTY_FORM);
  const [customCategory, setCustomCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // If no members, show a hard block
  const hasMembers = members && members.length > 0;

  // Populate form when editing
  useEffect(() => {
    if (editingExpense) {
      const isPayment = editingExpense.category === "Payment";
      setMode(isPayment ? "payment" : "expense");
      
      let cat = editingExpense.category || "Other";
      if (!isPayment && !CATEGORIES.includes(cat)) {
        setCustomCategory(cat);
        cat = "Custom";
      }

      setForm({
        description: editingExpense.description,
        amount: String(editingExpense.amount),
        paidBy: editingExpense.paidBy,
        category: cat,
        date: editingExpense.date
          ? new Date(editingExpense.date).toISOString().split("T")[0]
          : EMPTY_FORM.date,
        splitAmong: editingExpense.splitAmong || [],
        receiver: isPayment && editingExpense.splitAmong ? editingExpense.splitAmong[0] : "",
      });
    } else {
      setForm(EMPTY_FORM);
      setCustomCategory("");
      setMode("expense");
    }
    setErrors({});
  }, [editingExpense]);

  function validate() {
    const newErrors = {};
    if (mode === "expense") {
      if (!form.description.trim()) newErrors.description = "Description is required";
      if (form.category === "Custom" && !customCategory.trim()) newErrors.customCategory = "Specify category";
    }
    if (mode === "payment") {
      if (!form.receiver.trim()) newErrors.receiver = "Select who received the payment";
      if (form.paidBy === form.receiver) newErrors.receiver = "Cannot pay yourself";
    }
    
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

  function handleSplitChange(memberName) {
    setForm((prev) => {
      const current = prev.splitAmong || [];
      if (current.includes(memberName)) {
        return { ...prev, splitAmong: current.filter((n) => n !== memberName) };
      } else {
        return { ...prev, splitAmong: [...current, memberName] };
      }
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    
    const finalData = { ...form, amount: parseFloat(form.amount) };
    
    if (mode === "payment") {
      finalData.description = "Payment";
      finalData.category = "Payment";
      finalData.splitAmong = [form.receiver];
    } else {
      if (finalData.category === "Custom") {
        finalData.category = customCategory.trim();
      }
    }

    try {
      await onSubmit(finalData);
      if (!editingExpense) {
        setForm(EMPTY_FORM);
        setCustomCategory("");
      }
    } finally {
      setLoading(false);
    }
  }

  const isEditing = Boolean(editingExpense);

  if (!hasMembers && !isEditing) {
    return (
      <div className={styles["expense-form-wrapper"]}>
        <h2 className={styles["expense-form-title"]}>➕ Add Expense</h2>
        <div style={{ padding: "1.5rem", textAlign: "center", background: "#fffdf0", border: "1px solid #ffeeba", borderRadius: "8px", color: "#856404" }}>
          <p style={{ margin: 0, fontWeight: 600 }}>⚠️ No members found.</p>
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.9rem" }}>Please add members in the 'Members &amp; Balances' tab before logging expenses or payments.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["expense-form-wrapper"]}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h2 className={styles["expense-form-title"]} style={{ margin: 0 }}>
          {isEditing ? "✏️ Edit Entry" : (mode === "expense" ? "➕ Add Expense" : "💸 Settle Up")}
        </h2>
        
        {!isEditing && (
          <div style={{ display: "flex", gap: "0.5rem", background: "var(--input-bg)", padding: "0.25rem", borderRadius: "8px" }}>
            <button 
              type="button"
              onClick={() => { setMode("expense"); setErrors({}); }}
              style={{
                padding: "0.4rem 0.8rem", border: "none", borderRadius: "6px", fontSize: "0.85rem", cursor: "pointer",
                background: mode === "expense" ? "white" : "transparent",
                fontWeight: mode === "expense" ? 600 : 400,
                boxShadow: mode === "expense" ? "var(--shadow-sm)" : "none",
                color: mode === "expense" ? "var(--text-primary)" : "var(--text-secondary)"
              }}
            >Expense</button>
            <button 
              type="button"
              onClick={() => { setMode("payment"); setErrors({}); }}
              style={{
                padding: "0.4rem 0.8rem", border: "none", borderRadius: "6px", fontSize: "0.85rem", cursor: "pointer",
                background: mode === "payment" ? "white" : "transparent",
                fontWeight: mode === "payment" ? 600 : 400,
                boxShadow: mode === "payment" ? "var(--shadow-sm)" : "none",
                color: mode === "payment" ? "var(--text-primary)" : "var(--text-secondary)"
              }}
            >Payment</button>
          </div>
        )}
      </div>

      <form className={styles["expense-form"]} onSubmit={handleSubmit} noValidate>
        
        {mode === "expense" && (
          <div className={styles["form-group"]}>
            <label htmlFor="description">Description</label>
            <input
              id="description"
              name="description"
              type="text"
              placeholder="e.g. Hotel night 1"
              value={form.description}
              onChange={handleChange}
              className={errors.description ? styles["input-error"] : ""}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <span className={styles["error-msg"]} role="alert">{errors.description}</span>
            )}
          </div>
        )}

        <div className={styles["form-row"]}>
          <div className={styles["form-group"]}>
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
              className={errors.amount ? styles["input-error"] : ""}
              aria-invalid={!!errors.amount}
            />
            {errors.amount && (
              <span className={styles["error-msg"]} role="alert">{errors.amount}</span>
            )}
          </div>

          <div className={styles["form-group"]}>
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

        <div className={styles["form-row"]}>
          <div className={styles["form-group"]}>
            <label htmlFor="paidBy">Paid By</label>
            <select
              id="paidBy"
              name="paidBy"
              value={form.paidBy}
              onChange={handleChange}
              className={errors.paidBy ? styles["input-error"] : ""}
              aria-invalid={!!errors.paidBy}
            >
              <option value="">Select member</option>
              {members.map((m) => (
                <option key={m._id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
            {errors.paidBy && (
              <span className={styles["error-msg"]} role="alert">{errors.paidBy}</span>
            )}
          </div>

          {mode === "payment" ? (
            <div className={styles["form-group"]}>
              <label htmlFor="receiver">Paid To (Receiver)</label>
              <select
                id="receiver"
                name="receiver"
                value={form.receiver}
                onChange={handleChange}
                className={errors.receiver ? styles["input-error"] : ""}
                aria-invalid={!!errors.receiver}
              >
                <option value="">Select receiver</option>
                {members.map((m) => (
                  <option key={m._id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
              {errors.receiver && (
                <span className={styles["error-msg"]} role="alert">{errors.receiver}</span>
              )}
            </div>
          ) : (
            <div className={styles["form-group"]}>
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
          )}
        </div>

        {mode === "expense" && form.category === "Custom" && (
          <div className={styles["form-group"]}>
            <label htmlFor="customCategory">Custom Category Name</label>
            <input
              id="customCategory"
              type="text"
              placeholder="e.g. Ski Pass"
              value={customCategory}
              onChange={(e) => {
                setCustomCategory(e.target.value);
                if (errors.customCategory) setErrors(prev => ({ ...prev, customCategory: "" }));
              }}
              className={errors.customCategory ? styles["input-error"] : ""}
              aria-invalid={!!errors.customCategory}
            />
            {errors.customCategory && (
              <span className={styles["error-msg"]} role="alert">{errors.customCategory}</span>
            )}
          </div>
        )}

        {mode === "expense" && (
          <fieldset className={styles["form-group"]} style={{ marginTop: "1rem", border: "none", padding: 0 }}>
            <legend style={{ fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary, #666)", marginBottom: "0.5rem" }}>
              Split Among (leave empty for everyone)
            </legend>
            <div className="split-among-list" style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {members.map((m, idx) => {
                const isChecked = form.splitAmong.includes(m.name);
                const checkboxId = `split-${idx}`;
                return (
                  <label htmlFor={checkboxId} key={m._id} style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.9rem", cursor: "pointer", textTransform: "none", fontWeight: "normal" }}>
                    <input
                      id={checkboxId}
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleSplitChange(m.name)}
                      style={{ width: "auto", margin: 0 }}
                    />
                    {m.name}
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        <div className={styles["form-actions"]} style={{ marginTop: "1rem" }}>
          {isEditing && (
            <button
              type="button"
              className={`${styles.btn} ${styles["btn-secondary"]}`}
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          )}
          <button type="submit" className={`${styles.btn} ${styles["btn-primary"]}`} disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Save Changes" : (mode === "payment" ? "Log Payment" : "Add Expense")}
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
    splitAmong: PropTypes.arrayOf(PropTypes.string),
  }),
  onCancelEdit: PropTypes.func,
};

export default ExpenseForm;
