import Database from 'better-sqlite3';

const db = new Database('fintrack.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT UNIQUE,
    email TEXT UNIQUE,
    avatar TEXT,
    role TEXT
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    merchant TEXT NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    paymentMethod TEXT NOT NULL,
    notes TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS income_sources (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS emis (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    nextPaymentDate TEXT NOT NULL,
    status TEXT NOT NULL,
    totalTenure INTEGER NOT NULL,
    remainingTenure INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    bankDetails TEXT NOT NULL,
    amount REAL NOT NULL,
    lastPayment TEXT NOT NULL,
    billingCycle TEXT NOT NULL,
    nextBillDate TEXT NOT NULL,
    status TEXT NOT NULL,
    paymentMethod TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Try to migrate existing payload tables to the multi-tenant architecture locally if they already exist
try {
  db.exec('ALTER TABLE transactions ADD COLUMN user_id TEXT');
  db.exec('ALTER TABLE income_sources ADD COLUMN user_id TEXT');
  db.exec('ALTER TABLE emis ADD COLUMN user_id TEXT');
  db.exec('ALTER TABLE subscriptions ADD COLUMN user_id TEXT');
  
  // Settings table requires composite keys to map key -> value per user
  db.exec('ALTER TABLE settings RENAME TO settings_old');
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT,
      user_id TEXT,
      value TEXT NOT NULL,
      PRIMARY KEY (key, user_id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);
} catch (e) {
  // Silent fail: Columns already exist or migration already succeeded
}

// Failsafe for fresh initialization of settings composite table
db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT,
      user_id TEXT,
      value TEXT NOT NULL,
      PRIMARY KEY (key, user_id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
`);

export default db;
