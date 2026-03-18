import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./db/connection.js";
import expensesRouter from "./routes/expenses.js";

// Load env vars — import your partner's members router similarly
// import membersRouter from "./routes/members.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Routes
app.use("/api/expenses", expensesRouter);
// app.use("/api/members", membersRouter);  // ← Jianyu wires this in

// Health check
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

connectDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });
