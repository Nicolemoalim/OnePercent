const mysql = require('mysql2/promise');
require('dotenv').config();

// Create and export a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'onepercentdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 seconds
  ssl: false
});

// Test the connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Successfully connected to the database');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
})();

module.exports = pool;
