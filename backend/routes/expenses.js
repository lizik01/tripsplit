import express from "express";
import { getDb } from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET /api/expenses — list all expenses (optionally filter by tripId)
router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const query = {};
    
    if (req.user.role !== "admin") {
      const userGroups = await db.collection("groups").find({ createdBy: req.user.username }).toArray();
      const groupIds = userGroups.map(g => g._id.toString());
      if (req.query.tripId) {
         if (!groupIds.includes(req.query.tripId)) return res.json([]);
         query.tripId = req.query.tripId;
      } else {
         query.tripId = { $in: groupIds };
      }
    } else {
      if (req.query.tripId) {
        query.tripId = req.query.tripId;
      }
    }

    const expenses = await db
      .collection("expenses")
      .find(query)
      .sort({ date: -1 })
      .toArray();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// GET /api/expenses/:id — get a single expense
router.get("/:id", async (req, res) => {
  try {
    const db = getDb();
    const expense = await db
      .collection("expenses")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expense" });
  }
});

// POST /api/expenses — create a new expense
router.post("/", async (req, res) => {
  try {
    const db = getDb();
    const { description, amount, paidBy, category, tripId, date, splitAmong } =
      req.body;

    if (!description || !amount || !paidBy || !tripId) {
      return res
        .status(400)
        .json({ error: "description, amount, paidBy, and tripId are required" });
    }

    const newExpense = {
      description: description.trim(),
      amount: parseFloat(amount),
      paidBy: paidBy.trim(),
      category: category || "Other",
      tripId,
      date: date ? new Date(date) : new Date(),
      splitAmong: splitAmong || [],
      createdAt: new Date(),
    };

    const result = await db.collection("expenses").insertOne(newExpense);
    res.status(201).json({ ...newExpense, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to create expense" });
  }
});

// PUT /api/expenses/:id — update an expense
router.put("/:id", async (req, res) => {
  try {
    const db = getDb();
    const { description, amount, paidBy, category, date, splitAmong } =
      req.body;

    const updates = {};
    if (description !== undefined) updates.description = description.trim();
    if (amount !== undefined) updates.amount = parseFloat(amount);
    if (paidBy !== undefined) updates.paidBy = paidBy.trim();
    if (category !== undefined) updates.category = category;
    if (date !== undefined) updates.date = new Date(date);
    if (splitAmong !== undefined) updates.splitAmong = splitAmong;
    updates.updatedAt = new Date();

    const result = await db
      .collection("expenses")
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: updates },
        { returnDocument: "after" }
      );

    if (!result) return res.status(404).json({ error: "Expense not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to update expense" });
  }
});

// DELETE /api/expenses/:id — delete an expense
router.delete("/:id", async (req, res) => {
  try {
    const db = getDb();
    const result = await db
      .collection("expenses")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Expense not found" });
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

export default router;
