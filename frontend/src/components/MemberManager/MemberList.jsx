import PropTypes from "prop-types";

function MemberList({ members, balances, onDelete }) {
  if (!members || members.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">👥</span>
        <p>No members yet.</p>
        <small>Add some members to start tracking balances!</small>
      </div>
    );
  }

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
                <span className="member-name">{member.name}</span>
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
  onDelete: PropTypes.func.isRequired,
};

export default MemberList;
