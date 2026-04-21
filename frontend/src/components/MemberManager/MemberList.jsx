import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./MemberManager.module.css";

function MemberList({ members, balances, onEdit, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  if (!members || members.length === 0) {
    return (
      <div className={styles["empty-state"] || "empty-state"} style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
        <span className={styles["empty-icon"]} aria-hidden="true" style={{ fontSize: "2rem" }}>👥</span>
        <p>No members yet.</p>
        <small>Add some members to start tracking balances!</small>
      </div>
    );
  }

  const handleStartEdit = (member) => {
    setEditingId(member._id);
    setEditName(member.name);
  };

  const handleSaveEdit = (id) => {
    if (editName.trim()) {
      onEdit(id, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className={styles["member-list-wrapper"]}>
      <h2 className={styles["member-list-title"]}>Trip Balances</h2>
      <ul className={styles["member-list"]} style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {members.map((member) => {
          const stats = balances[member.name] || { paid: 0, owed: 0, total: 0 };
          const isPositive = stats.total > 0;
          const isNegative = stats.total < 0;
          
          let balanceClass = styles["balance-zero"];
          if (isPositive) balanceClass = styles["balance-positive"];
          if (isNegative) balanceClass = styles["balance-negative"];

          return (
            <li key={member._id} className={styles["member-item"]}>
              <div className={styles["member-info"]}>
                {editingId === member._id ? (
                  <div className={styles["edit-mode"]} style={{ display: "flex", gap: "0.5rem" }}>
                    <label htmlFor={`edit-name-${member._id}`} className="visually-hidden" style={{ display: 'none' }}>Edit member name</label>
                    <input 
                      id={`edit-name-${member._id}`}
                      type="text" 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)} 
                      autoFocus
                      className={styles["edit-input"]}
                      style={{ padding: "0.2rem 0.5rem", borderRadius: "4px", border: "1px solid var(--border)" }}
                    />
                    <button 
                      className={styles["btn-icon"] || "btn-icon"} 
                      onClick={() => handleSaveEdit(member._id)}
                      aria-label="Save member name"
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                    >💾</button>
                    <button 
                      className={styles["btn-icon"] || "btn-icon"} 
                      onClick={() => setEditingId(null)}
                      aria-label="Cancel edit"
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                    >❌</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span className={styles["member-name"]}>{member.name}</span>
                    <button 
                      className={styles["btn-icon"] || "btn-icon"} 
                      onClick={() => handleStartEdit(member)}
                      aria-label={`Edit member ${member.name}`}
                      title="Edit member name"
                      style={{ fontSize: "0.8rem", background: "none", border: "none", cursor: "pointer" }}
                    >
                      ✏️
                    </button>
                  </div>
                )}
                <div className={styles["member-stats"]}>
                  <span className={`${styles.stat} ${styles.detail}`}>Paid: ${stats.paid.toFixed(2)}</span>
                  <span className={`${styles.stat} ${styles.detail}`}>Owes: ${stats.owed.toFixed(2)}</span>
                </div>
              </div>
              
              <div className={styles["member-balance-container"]}>
                <div className={`${styles["member-total"]} ${balanceClass}`}>
                  {isPositive ? "Gets back " : isNegative ? "Owes " : "Settled up"}
                  {stats.total !== 0 && `$${Math.abs(stats.total).toFixed(2)}`}
                </div>
                <button 
                  className={`${styles["btn-icon"] || "btn-icon"} ${styles["btn-delete"] || "btn-delete"}`} 
                  onClick={() => onDelete(member._id)}
                  aria-label={`Remove member ${member.name}`}
                  title="Remove member"
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  🗑️
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

MemberList.propTypes = {
  members: PropTypes.array.isRequired,
  balances: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default MemberList;
