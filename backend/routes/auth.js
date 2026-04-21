import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { getDb } from "../db/connection.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });

  const assignedRole = role === "admin" ? "admin" : "user";

  try {
    const db = getDb();
    const existing = await db.collection("users").findOne({ username });
    if (existing)
      return res.status(400).json({ error: "Username already taken" });

    const hash = await bcrypt.hash(password, 10);
    await db.collection("users").insertOne({ username, password: hash, role: assignedRole });
    res.status(201).json({ message: "User created. Please log in." });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ error: info?.message || "Login failed" });
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ message: "Logged in", user: { username: user.username, role: user.role || 'user' } });
    });
  })(req, res, next);
});

// Logout
router.post("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
});

// Check current session
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ user: { username: req.user.username, role: req.user.role || 'user' } });
  }
  res.status(401).json({ error: "Not authenticated" });
});

export default router;
