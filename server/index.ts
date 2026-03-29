import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Auth & Users
app.post('/api/auth/login', (req, res) => {
  try {
    const { phone, email } = req.body;
    let user;
    if (phone) {
      const stmt = db.prepare('SELECT * FROM users WHERE phone = ?');
      user = stmt.get(phone);
      if (!user) {
        const id = 'user_' + Math.random().toString(36).substr(2, 9);
        db.prepare('INSERT INTO users (id, phone) VALUES (?, ?)').run(id, phone);
        user = { id, phone };
      }
    } else if (email) {
      const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
      user = stmt.get(email);
      if (!user) {
        const id = 'user_' + Math.random().toString(36).substr(2, 9);
        db.prepare('INSERT INTO users (id, email) VALUES (?, ?)').run(id, email);
        user = { id, email };
      }
    } else {
      return res.status(400).json({ error: 'Phone or email required' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/users/profile', (req, res) => {
  try {
    const { id, name, avatar, role } = req.body;
    db.prepare('UPDATE users SET name = ?, avatar = ?, role = ? WHERE id = ?').run(name || null, avatar || null, role || null, id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Admin/Users specific household endpoint
app.get('/api/admin/users', (req, res) => {
  try {
    const users = db.prepare('SELECT id, name, phone, email, avatar, role FROM users').all();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Middleware to check user_id
const requireUser = (req: any, res: any, next: any) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: Missing X-User-Id header' });
  }
  req.userId = userId;
  next();
};

app.use('/api/transactions', requireUser);
app.get('/api/transactions', (req: any, res) => {
  try {
    const transactions = db.prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC').all(req.userId);
    res.json(transactions);
  } catch (error) { res.status(500).json({ error: 'Error' }); }
});
app.post('/api/transactions', (req: any, res) => {
  try {
    const { id, merchant, category, amount, date, status, paymentMethod, notes } = req.body;
    db.prepare(`INSERT INTO transactions (id, user_id, merchant, category, amount, date, status, paymentMethod, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(id, req.userId, merchant, category, amount, date, status, paymentMethod, notes || null);
    res.status(201).json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Error' }); }
});
app.delete('/api/transactions/:id', (req: any, res) => {
  try {
    db.prepare('DELETE FROM transactions WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Error' }); }
});

app.use('/api/income', requireUser);
app.get('/api/income', (req: any, res) => {
  try { res.json(db.prepare('SELECT * FROM income_sources WHERE user_id = ?').all(req.userId)); } 
  catch (error) { res.status(500).json({ error: 'Error' }); }
});
app.post('/api/income', (req: any, res) => {
  try {
    const { id, name, amount } = req.body;
    db.prepare('INSERT INTO income_sources (id, user_id, name, amount) VALUES (?, ?, ?, ?)').run(id, req.userId, name, amount);
    res.status(201).json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Error' }); }
});
app.delete('/api/income/:id', (req: any, res) => {
  try { db.prepare('DELETE FROM income_sources WHERE id = ? AND user_id = ?').run(req.params.id, req.userId); res.json({ success: true }); } 
  catch (error) { res.status(500).json({ error: 'Error' }); }
});

app.use('/api/emis', requireUser);
app.get('/api/emis', (req: any, res) => {
  try { res.json(db.prepare('SELECT * FROM emis WHERE user_id = ?').all(req.userId)); } 
  catch (error) { res.status(500).json({ error: 'Error' }); }
});
app.post('/api/emis', (req: any, res) => {
  try {
    const { id, name, amount, nextPaymentDate, status, totalTenure, remainingTenure } = req.body;
    db.prepare('INSERT OR REPLACE INTO emis (id, user_id, name, amount, nextPaymentDate, status, totalTenure, remainingTenure) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(id, req.userId, name, amount, nextPaymentDate, status, totalTenure, remainingTenure);
    res.status(201).json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Error' }); }
});
app.delete('/api/emis/:id', (req: any, res) => {
  try { db.prepare('DELETE FROM emis WHERE id = ? AND user_id = ?').run(req.params.id, req.userId); res.json({ success: true }); } 
  catch (error) { res.status(500).json({ error: 'Error' }); }
});

app.use('/api/subscriptions', requireUser);
app.get('/api/subscriptions', (req: any, res) => {
  try { res.json(db.prepare('SELECT * FROM subscriptions WHERE user_id = ?').all(req.userId)); } 
  catch (error) { res.status(500).json({ error: 'Error' }); }
});
app.post('/api/subscriptions', (req: any, res) => {
  try {
    const { id, name, category, bankDetails, amount, lastPayment, billingCycle, nextBillDate, status, paymentMethod } = req.body;
    db.prepare('INSERT OR REPLACE INTO subscriptions (id, user_id, name, category, bankDetails, amount, lastPayment, billingCycle, nextBillDate, status, paymentMethod) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(id, req.userId, name, category || 'Subscriptions', bankDetails || '', amount, lastPayment || '', billingCycle || 'Monthly', nextBillDate || '', status || 'Active', paymentMethod || 'Credit Card');
    res.status(201).json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Error' }); }
});
app.delete('/api/subscriptions/:id', (req: any, res) => {
  try { db.prepare('DELETE FROM subscriptions WHERE id = ? AND user_id = ?').run(req.params.id, req.userId); res.json({ success: true }); } 
  catch (error) { res.status(500).json({ error: 'Error' }); }
});

app.use('/api/settings', requireUser);
app.get('/api/settings', (req: any, res) => {
  try {
    const settings = db.prepare('SELECT * FROM settings WHERE user_id = ?').all(req.userId);
    const settingsObj = (settings as any[]).reduce((acc: any, curr: any) => { acc[curr.key] = curr.value; return acc; }, {});
    res.json(settingsObj);
  } catch (error) { res.status(500).json({ error: 'Error' }); }
});
app.post('/api/settings', (req: any, res) => {
  try {
    const { key, value } = req.body;
    db.prepare('INSERT OR REPLACE INTO settings (key, user_id, value) VALUES (?, ?, ?)').run(key, req.userId, value.toString());
    res.status(200).json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Error' }); }
});

// Receipt Scanning via Gemini API (server-side to keep API key secure)
app.post('/api/scan-receipt', async (req, res) => {
  try {
    const { imageData, mimeType, categories } = req.body;
    if (!imageData || !mimeType) {
      return res.status(400).json({ error: 'Missing imageData or mimeType' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured on the server' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: imageData,
                mimeType,
              },
            },
            {
              text: `Extract the merchant name, total amount (as a number), date (in YYYY-MM-DD format), and the most appropriate category from this receipt. Categories available: ${(categories || []).join(', ')}`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchant: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            date: { type: Type.STRING },
            category: { type: Type.STRING },
          },
          required: ['merchant', 'amount', 'date', 'category'],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    res.json(result);
  } catch (error: any) {
    console.error('Error scanning receipt:', error?.message || error);
    res.status(500).json({ error: 'Failed to scan receipt' });
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
