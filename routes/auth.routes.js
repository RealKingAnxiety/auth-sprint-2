const express = require('express');
const router = express.Router();
const db = require('../db');

// REGISTER
router.post('/register', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email + password required' });

  try {
    const stmt = db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
    const result = stmt.run(email, password, role || 'buyer');
    req.session.userId = result.lastInsertRowid;
    req.session.role = role || 'buyer';
    return res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    // user exists
    return res.status(400).json({ error: 'User already exists' });
  }
});

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  req.session.userId = user.id;
  req.session.role = user.role;
  return res.json({ success: true, id: user.id });
});

module.exports = router;
