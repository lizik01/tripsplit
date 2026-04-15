import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MemberForm from "./MemberForm";
import MemberList from "./MemberList";
import "./MemberManager.css";

function MemberManager({ tripId, members, refreshMembers }) {
  const [expenses, setExpenses] = useState([]);
  const [toast, setToast] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`/api/expenses?tripId=${tripId}`);
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [tripId]);

  // Calculate balances
  const balances = {};
  members.forEach((m) => {
    balances[m.name] = { paid: 0, owed: 0, total: 0 };
  });

  expenses.forEach((exp) => {
    // How much this person paid
    if (balances[exp.paidBy]) {
      balances[exp.paidBy].paid += exp.amount;
    }

    // How much this person owes
    const splitAmong =
      exp.splitAmong && exp.splitAmong.length > 0
        ? exp.splitAmong
        : members.map((m) => m.name);

    if (splitAmong.length > 0) {
      const splitAmount = exp.amount / splitAmong.length;
      splitAmong.forEach((name) => {
        if (balances[name]) {
          balances[name].owed += splitAmount;
        }
      });
    }
  });

  // Calculate final totals
  Object.keys(balances).forEach((name) => {
    balances[name].total = balances[name].paid - balances[name].owed;
  });

  async function handleAddMember(name) {
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, tripId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add member");
      }

      showToast("Member added!");
      refreshMembers();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleEditMember(memberId, newName) {
    try {
      const res = await fetch(`/api/members/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update member");
      }

      showToast("Member updated!");
      refreshMembers();
      // Also potentially refresh expenses if they are open in another tab, 
      // but here we can just refresh local expenses if necessary
      fetchExpenses();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleDeleteMember(memberId) {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      const res = await fetch(`/api/members/${memberId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete member");
      }

      showToast("Member deleted!");
      refreshMembers();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  return (
    <div className="member-manager">
      {toast && (
        <div className={`toast toast-${toast.type}`} role="alert">
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      <section className="member-manager-form">
        <MemberForm onSubmit={handleAddMember} />
      </section>

      <section className="member-manager-list">
        <MemberList
          members={members}
          balances={balances}
          onEdit={handleEditMember}
          onDelete={handleDeleteMember}
        />
      </section>
    </div>
  );
}

MemberManager.propTypes = {
  tripId: PropTypes.string.isRequired,
  members: PropTypes.array.isRequired,
  refreshMembers: PropTypes.func.isRequired,
};

export default MemberManager;
