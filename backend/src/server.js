import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// import prisma from "./config/db.js";
import pool from "./config/db.js";
import createUsersTable from "./config/intiDB.js";
import authRoutes from "./routes/auth.routes.js";
import authMiddleware from "../src/middleware/auth.middleware.js";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);

// test route
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running 🚀" });
});

// test users table
// app.get("/api/test-users-table", async (req, res) => {
//   const result = await pool.query("SELECT * FROM users");
//   res.json(result.rows);
// });

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed a protected route 🎉",
    user: req.user,
  });
});

const PORT = process.env.PORT;

async function startServer() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL connected");

    // create Users Table once
    await createUsersTable();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed", error);
    process.exit(1);
  }
}

startServer();
