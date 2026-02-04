const express = require('express');
const db = require('../db');
const { requireLogin } = require('../auth');

const router = express.Router();

router.get('/my-orders', requireLogin, (req, res) => {
  const orders = db
    .prepare('SELECT * FROM orders WHERE buyer_id = ?')
    .all(req.session.user.id);

  res.json(orders);
});

router.get('/orders-for-my-products', requireLogin, (req, res) => {
  const orders = db.prepare(`
    SELECT orders.*
    FROM orders
    JOIN products ON orders.product_id = products.id
    WHERE products.seller_id = ?
  `).all(req.session.user.id);

  res.json(orders);
});

module.exports = router;
