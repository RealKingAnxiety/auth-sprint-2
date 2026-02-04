const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE PRODUCT
router.post('/products', (req, res) => {
  if (!req.session.userId) return res.status(403).json({ error: 'Unauthorized' });
  if (req.session.role === 'buyer') return res.status(403).json({ error: 'Buyers cannot create products' });

  const { name } = req.body;
  const info = db.prepare('INSERT INTO products (name, ownerId) VALUES (?, ?)').run(name, req.session.userId);
  res.json({ success: true, id: info.lastInsertRowid });
});

// EDIT PRODUCT
router.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  if (product.ownerId !== req.session.userId) return res.status(403).json({ error: 'Unauthorized' });

  db.prepare('UPDATE products SET name = ? WHERE id = ?').run(name, id);
  res.json({ success: true, id: Number(id) });
});

// DELETE PRODUCT
router.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  if (product.ownerId !== req.session.userId) return res.status(403).json({ error: 'Unauthorized' });

  db.prepare('DELETE FROM products WHERE id = ?').run(id);
  res.json({ success: true, id: Number(id) });
});

module.exports = router;
