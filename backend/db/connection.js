const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config()
const pool = new Pool ({
    host: process.env.DB_HOST, 
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,

})

module.exports = pool;