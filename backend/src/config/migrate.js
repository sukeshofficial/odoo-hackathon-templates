import pool from "./db.js";

export const runMigrations = async () => {
  try {
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS reset_token TEXT,
      ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP
    `);

    console.log("✅ DB migrations completed");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  }
};
