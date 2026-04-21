import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./GroupManager.module.css";

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
    <section className={styles["group-manager"]} aria-labelledby="group-manager-title">
      <h2 id="group-manager-title">Your Groups</h2>
      
      {error && <p className={styles["error-msg"]} role="alert">{error}</p>}
      
      <form className={styles["create-group-form"]} onSubmit={handleCreateGroup}>
        <input
          id="newGroupName"
          type="text"
          placeholder="New group name..."
          aria-label="New group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          required
        />
        <button type="submit">Create Group</button>
      </form>

      {loading ? (
        <p aria-live="polite">Loading groups...</p>
      ) : groups.length === 0 ? (
        <p>You don't have any groups yet. Create one to get started!</p>
      ) : (
        <ul className={styles["group-list"]}>
          {groups.map((g) => (
            <li key={g._id}>
              <button 
                className={styles["group-card"]} 
                onClick={() => onSelectGroup(g._id)}
                aria-label={`Select group ${g.name}`}
              >
                <div className={styles["group-card-icon"]} aria-hidden="true">👥</div>
                <div className={styles["group-card-details"]}>
                  <h3>{g.name}</h3>
                  <span className={styles["group-card-creator"]}>Created by: {g.createdBy}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

GroupManager.propTypes = {
  onSelectGroup: PropTypes.func.isRequired,
};

export default GroupManager;
