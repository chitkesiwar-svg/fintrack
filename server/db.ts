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

  CREATE TABLE IF NOT EXISTS emis (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    nextPaymentDate TEXT NOT NULL,
    status TEXT NOT NULL,
    totalTenure INTEGER NOT NULL,
    remainingTenure INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    bankDetails TEXT NOT NULL,
    amount REAL NOT NULL,
    lastPayment TEXT NOT NULL,
    billingCycle TEXT NOT NULL,
    nextBillDate TEXT NOT NULL,
    status TEXT NOT NULL,
    paymentMethod TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

export default db;
