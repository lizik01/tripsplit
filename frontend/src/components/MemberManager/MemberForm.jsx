import { useState } from "react";
import PropTypes from "prop-types";

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
    <div className="member-form-wrapper">
      <h2 className="member-form-title">➕ Add Trip Member</h2>
      <form className="member-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group member-form-group">
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
            className={error ? "input-error" : ""}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
        {error && <span className="error-msg">{error}</span>}
      </form>
    </div>
  );
}

MemberForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default MemberForm;
