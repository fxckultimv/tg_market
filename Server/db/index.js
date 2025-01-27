const { Pool } = require('pg')
const fs = require('fs')
// require('dotenv').config()

const postgresPassword = fs
    .readFileSync('/run/secrets/db_password', 'utf8')
    .trim()

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'postgres',
    database: process.env.POSTGRES_DB || 'TeleAd',
    password: postgresPassword,
    port: process.env.POSTGRES_PORT || 5432,
})

module.exports = {
    query: (text, params) => pool.query(text, params),
}
