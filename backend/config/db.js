const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool
const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  authPlugins: {
    mysql_clear_password: () => () => Buffer.alloc(0)
  }
};

// Only add password if it's not empty
if (process.env.DB_PASSWORD && process.env.DB_PASSWORD.trim() !== '') {
  connectionConfig.password = process.env.DB_PASSWORD;
}

const pool = mysql.createPool(connectionConfig);

// Get promise-based connection
const promisePool = pool.promise();

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    return;
  }
  console.log('✓ MySQL Database connected successfully');
  connection.release();
});

module.exports = promisePool;
