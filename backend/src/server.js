import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// import prisma from "./config/db.js";
import { runMigrations } from "./config/migrate.js";
import pool from "./config/db.js";
import createUsersTable from "./config/intiDB.js";
import authRoutes from "./routes/auth.routes.js";
import authMiddleware from "../src/middleware/auth.middleware.js";

dotenv.config();

const app = express();

// middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));

// test route
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running 🚀" });
});

// test users table
// app.get("/api/test-users-table", async (req, res) => {
//   const result = await pool.query("SELECT * FROM users");
//   res.json(result.rows);
// });

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, name, email, profile_photo, created_at
      FROM users
      WHERE id = $1
      `,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("ME ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT;

async function startServer() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL connected");

    // create Users Table once
    await createUsersTable();
    await runMigrations();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed", error);
    process.exit(1);
  }
}

startServer();
