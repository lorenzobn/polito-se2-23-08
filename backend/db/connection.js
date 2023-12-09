const { Pool } = require('pg');
const dotenv = require('dotenv');
const logger = require('../services/logger');

dotenv.config()
const pool = new Pool ({
    host: process.env.DB_HOST, 
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,

})

async function checkConnection() {
  try {
    const client = await pool.connect();
    logger.info("Connected to the database");
    client.release(); // Release the client back to the pool
    return true;
  } catch (error) {
    logger.error("Error connecting to the database:", error.message);
    return false;
  }
}

checkConnection();
module.exports = pool;