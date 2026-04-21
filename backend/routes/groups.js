import express from "express";
import { getDb } from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET /api/groups — list groups for the user (admin sees all)
router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const query = {};
    if (req.user.role !== "admin") {
      query.createdBy = req.user.username;
    }
    const groups = await db
      .collection("groups")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch groups" });
  }
});

// POST /api/groups — create a new group
router.post("/", async (req, res) => {
  try {
    const db = getDb();
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Group name is required" });
    }

    const newGroup = {
      name: name.trim(),
      createdBy: req.user.username,
      createdAt: new Date(),
    };

    const result = await db.collection("groups").insertOne(newGroup);
    const groupId = result.insertedId.toString();

    // Automatically add the creator as a member of this new group
    await db.collection("members").insertOne({
      name: req.user.username,
      tripId: groupId, 
      createdAt: new Date(),
    });

    res.status(201).json({ ...newGroup, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to create group" });
  }
});

export default router;
