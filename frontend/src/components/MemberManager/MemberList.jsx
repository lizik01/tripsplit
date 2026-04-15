import { useState } from "react";
import PropTypes from "prop-types";

function MemberList({ members, balances, onEdit, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  if (!members || members.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">👥</span>
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
    <div className="member-list-wrapper">
      <h2 className="member-list-title">Trip Balances</h2>
      <div className="member-list">
        {members.map((member) => {
          const stats = balances[member.name] || { paid: 0, owed: 0, total: 0 };
          const isPositive = stats.total > 0;
          const isNegative = stats.total < 0;
          
          let balanceClass = "balance-zero";
          if (isPositive) balanceClass = "balance-positive";
          if (isNegative) balanceClass = "balance-negative";

          return (
            <div key={member._id} className="member-item">
              <div className="member-info">
                {editingId === member._id ? (
                  <div className="edit-mode" style={{ display: "flex", gap: "0.5rem" }}>
                    <input 
                      type="text" 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)} 
                      autoFocus
                      className="edit-input"
                      style={{ padding: "0.2rem 0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                    <button className="btn-icon" onClick={() => handleSaveEdit(member._id)}>💾</button>
                    <button className="btn-icon" onClick={() => setEditingId(null)}>❌</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span className="member-name">{member.name}</span>
                    <button 
                      className="btn-icon" 
                      onClick={() => handleStartEdit(member)}
                      title="Edit member name"
                      style={{ fontSize: "0.8rem" }}
                    >
                      ✏️
                    </button>
                  </div>
                )}
                <div className="member-stats">
                  <span className="stat detail">Paid: ${stats.paid.toFixed(2)}</span>
                  <span className="stat detail">Owes: ${stats.owed.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="member-balance-container">
                <div className={`member-total ${balanceClass}`}>
                  {isPositive ? "Gets back " : isNegative ? "Owes " : "Settled up"}
                  {stats.total !== 0 && `$${Math.abs(stats.total).toFixed(2)}`}
                </div>
                <button 
                  className="btn-icon btn-delete" 
                  onClick={() => onDelete(member._id)}
                  title="Remove member"
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>
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
