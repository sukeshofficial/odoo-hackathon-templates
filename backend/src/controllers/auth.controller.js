import bcrypt from "bcrypt";
import pool from "../config/db.js";
import { generateToken } from "../utils/jwt.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic Validation all the required fields exist?
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    // Password length must be > 6
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Check if User already exists?
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "User already exists with this email",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert New User
    const newUser = await pool.query(
      `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
      `,
      [name, email, hashedPassword]
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic Validation all the required fields exist?
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find User from DB
    const userResult = await pool.query(
      "SELECT id, name, email, password, created_at FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // User exists, then store in user
    const user = userResult.rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password credentials",
      });
    }

    // Remove password before sending
    delete user.password;

    // Create token
    const token = generateToken({ userId: user.id });

    // Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Success
    return res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
};
