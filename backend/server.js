import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./db/connection.js";
import expensesRouter from "./routes/expenses.js";

// Load env vars — import your partner's members router similarly
import membersRouter from "./routes/members.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Middleware to ensure DB connection is active for serverless functions
app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (err) {
    console.error("DB Connection Error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Routes
app.use("/api/expenses", expensesRouter);
app.use("/api/members", membersRouter);

// Health check
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// Only listen locally, Vercel Serverless handles the port binding automatically
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Local dev server running on port ${PORT}`);
  });
}

// Export the Express API so Vercel can run it as a serverless function!
export default app;
