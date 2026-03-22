import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Transactions
app.get('/api/transactions', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM transactions ORDER BY date DESC');
    const transactions = stmt.all();
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/transactions', (req, res) => {
  try {
    const { id, merchant, category, amount, date, status, paymentMethod, notes } = req.body;
    const stmt = db.prepare(`
      INSERT INTO transactions (id, merchant, category, amount, date, status, paymentMethod, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, merchant, category, amount, date, status, paymentMethod, notes || null);
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/transactions/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM transactions WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Income Sources
app.get('/api/income', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM income_sources');
    const incomeSources = stmt.all();
    res.json(incomeSources);
  } catch (error) {
    console.error('Error fetching income sources:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/income', (req, res) => {
  try {
    const { id, name, amount } = req.body;
    const stmt = db.prepare(`
      INSERT INTO income_sources (id, name, amount)
      VALUES (?, ?, ?)
    `);
    stmt.run(id, name, amount);
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error adding income source:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/income/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM income_sources WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// EMIs
app.get('/api/emis', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM emis');
    res.json(stmt.all());
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/emis', (req, res) => {
  try {
    const { id, name, amount, nextPaymentDate, status, totalTenure, remainingTenure } = req.body;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO emis (id, name, amount, nextPaymentDate, status, totalTenure, remainingTenure)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, name, amount, nextPaymentDate, status, totalTenure, remainingTenure);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/emis/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM emis WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Subscriptions
app.get('/api/subscriptions', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM subscriptions');
    res.json(stmt.all());
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/subscriptions', (req, res) => {
  try {
    const { id, name, category, bankDetails, amount, lastPayment, billingCycle, nextBillDate, status, paymentMethod } = req.body;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO subscriptions (id, name, category, bankDetails, amount, lastPayment, billingCycle, nextBillDate, status, paymentMethod)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, name, category || 'Subscriptions', bankDetails || '', amount, lastPayment || '', billingCycle || 'Monthly', nextBillDate || '', status || 'Active', paymentMethod || 'Credit Card');
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/subscriptions/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM subscriptions WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Settings
app.get('/api/settings', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM settings');
    const settings = stmt.all();
    const settingsObj = (settings as any[]).reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/settings', (req, res) => {
  try {
    const { key, value } = req.body;
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    stmt.run(key, value.toString());
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve production build of Vite React app
app.use(express.static(path.join(__dirname, '../dist')));

// Send all other requests back to the React app (Client-side routing fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
