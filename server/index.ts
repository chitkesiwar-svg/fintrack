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

// Serve production build of Vite React app
app.use(express.static(path.join(__dirname, '../dist')));

// Send all other requests back to the React app (Client-side routing fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
