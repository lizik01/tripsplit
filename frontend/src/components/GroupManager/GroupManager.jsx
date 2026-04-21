import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./GroupManager.css";

function GroupManager({ onSelectGroup }) {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/groups", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setGroups(data);
      } else {
        setError("Failed to fetch groups.");
      }
    } catch (err) {
      setError("Network error fetching groups.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newGroupName }),
      });

      if (res.ok) {
        setNewGroupName("");
        fetchGroups();
      } else {
        setError("Failed to create group.");
      }
    } catch (err) {
      setError("Network error creating group.");
    }
  };

  return (
    <div className="group-manager">
      <h2>Your Groups</h2>
      {error && <p className="error-msg">{error}</p>}
      
      <form className="create-group-form" onSubmit={handleCreateGroup}>
        <input
          type="text"
          placeholder="New group name..."
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          required
        />
        <button type="submit">Create Group</button>
      </form>

      {loading ? (
        <p>Loading groups...</p>
      ) : groups.length === 0 ? (
        <p>You don't have any groups yet. Create one to get started!</p>
      ) : (
        <ul className="group-list">
          {groups.map((g) => (
            <li key={g._id} className="group-card" onClick={() => onSelectGroup(g._id)}>
              <div className="group-card-icon">👥</div>
              <div className="group-card-details">
                <h3>{g.name}</h3>
                <span className="group-card-creator">Created by: {g.createdBy}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

GroupManager.propTypes = {
  onSelectGroup: PropTypes.func.isRequired,
};

export default GroupManager;
