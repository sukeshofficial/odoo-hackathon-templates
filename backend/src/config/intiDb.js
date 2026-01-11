import pool from "./db.js";

const createUsersTable = async () => {
  const query = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

  try {
    await pool.query(query);
    console.log("✅ Users table ready");
  } catch (error) {
    console.error("❌ Error creating users table", error);
    throw error;
  }
};

export default createUsersTable;