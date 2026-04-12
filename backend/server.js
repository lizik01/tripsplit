import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import MongoStore from "connect-mongo";
import { connectDb, getDb } from "./db/connection.js";
import expensesRouter from "./routes/expenses.js";
import membersRouter from "./routes/members.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS — must be before everything else
const allowedOrigins = process.env.VERCEL
  ? [process.env.FRONTEND_URL]          // 在 Vercel 环境变量里设置前端域名
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,                   // 允许携带 cookie
  })
);

app.use(express.json());

// DB connection middleware
app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (err) {
    console.error("DB Connection Error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "tripsplit-dev-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      dbName: process.env.DB_NAME || "tripsplit",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: process.env.VERCEL ? "none" : "lax",
      secure: !!process.env.VERCEL,
    },
  })
);

// Passport setup
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const db = getDb();
      const user = await db.collection("users").findOne({ username });
      if (!user) return done(null, false, { message: "User not found" });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: "Wrong password" });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.username));
passport.deserializeUser(async (username, done) => {
  try {
    const db = getDb();
    const user = await db.collection("users").findOne({ username });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(passport.initialize());
app.use(passport.session());

// Auth routes (public)
app.use("/api/auth", authRouter);

// Auth guard for all other API routes
app.use("/api", (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Not authenticated. Please log in." });
});

// Protected routes
app.use("/api/expenses", expensesRouter);
app.use("/api/members", membersRouter);

// Health check
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Local dev server running on port ${PORT}`);
  });
}

export default app;
