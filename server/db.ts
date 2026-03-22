import Database from 'better-sqlite3';

const db = new Database('fintrack.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    merchant TEXT NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    paymentMethod TEXT NOT NULL,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS income_sources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    amount REAL NOT NULL
  );
`);

export default db;
