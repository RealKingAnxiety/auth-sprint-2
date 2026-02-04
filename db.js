const Database = require('better-sqlite3');
const db = new Database(':memory:');

// USERS TABLE
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT
  )
`).run();

// PRODUCTS TABLE
db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    ownerId INTEGER
  )
`).run();

module.exports = db;
