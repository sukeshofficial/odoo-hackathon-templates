import bcrypt from "bcrypt";
import crypto from "crypto";
import pool from "../config/db.js";
import { generateToken } from "../utils/jwt.js";
import { sendEmail } from "../utils/sendEmail.js";
import path from "path";

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
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
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
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    // Always return success (security best practice)
    if (userResult.rows.length === 0) {
      return res.json({
        message: "If this email exists, a reset link has been sent",
      });
    }

    const userId = userResult.rows[0].id;

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      `
      UPDATE users
      SET reset_token = $1,
          reset_token_expiry = $2
      WHERE id = $3
      `,
      [hashedToken, expiry, userId]
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: email,
      subject: "Reset your password",
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
        <br/>
        <p>If you didn’t request this, you can ignore this email.</p>
      `,
    });

    return res.json({
      message: "If this email exists, a reset link has been sent",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password too short" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const result = await pool.query(
      `
      SELECT id FROM users
      WHERE reset_token = $1
        AND reset_token_expiry > NOW()
      `,
      [hashedToken]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const userId = result.rows[0].id;
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `
      UPDATE users
      SET password = $1,
          reset_token = NULL,
          reset_token_expiry = NULL
      WHERE id = $2
      `,
      [hashedPassword, userId]
    );

    return res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
