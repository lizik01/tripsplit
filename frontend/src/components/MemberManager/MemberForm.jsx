import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./MemberManager.module.css";

function MemberForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    
    setError("");
    setLoading(true);
    try {
      await onSubmit(name.trim());
      setName("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles["member-form-wrapper"]}>
      <h2 className={styles["member-form-title"]}>
        <span aria-hidden="true">➕</span> Add Trip Member
      </h2>
      <form className={styles["member-form"]} onSubmit={handleSubmit} noValidate>
        <div className={`${styles["form-group"]} ${styles["member-form-group"]}`}>
          <label htmlFor="memberName" className="visually-hidden" style={{ display: 'none' }}>
            Member Name
          </label>
          <input
            id="memberName"
            name="memberName"
            type="text"
            placeholder="e.g. Jianyu"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            className={error ? styles["input-error"] : ""}
            aria-invalid={!!error}
            style={{ 
              padding: "0.6rem 0.75rem",
              border: "1.5px solid var(--border)",
              borderRadius: "8px",
              fontSize: "0.95rem"
            }}
          />
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{
              padding: "0.6rem 1.25rem",
              background: "var(--success, #28a745)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
        {error && <div className={styles["error-msg"]} role="alert" style={{ color: "var(--danger)", fontSize: "0.85rem", marginTop: "0.5rem" }}>{error}</div>}
      </form>
    </div>
  );
}

MemberForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default MemberForm;
