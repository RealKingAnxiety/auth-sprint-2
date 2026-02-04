const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(session({
  secret: 'dev',
  resave: false,
  saveUninitialized: false
}));

// In-memory "DB"
const users = [];
const products = [];
let productIdCounter = 1;

// REGISTER
app.post('/register', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email + password required' });
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'User already exists' });

  const user = { id: users.length + 1, email, password, role: role || 'buyer' };
  users.push(user);
  req.session.userId = user.id;
  req.session.role = user.role;
  res.json({ success: true, id: user.id });
});

// LOGIN
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  req.session.userId = user.id;
  req.session.role = user.role;
  res.json({ success: true, id: user.id });
});

// LOGOUT
app.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

// CREATE PRODUCT
app.post('/products', (req, res) => {
  if (!req.session.userId) return res.status(403).json({ error: 'Unauthorized' });
  if (req.session.role === 'buyer') return res.status(403).json({ error: 'Buyers cannot create products' });

  const { name } = req.body;
  const product = { id: productIdCounter++, name, ownerId: req.session.userId };
  products.push(product);
  res.json({ success: true, id: product.id });
});

// EDIT PRODUCT
app.put('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  if (product.ownerId !== req.session.userId) return res.status(403).json({ error: 'Unauthorized' });

  product.name = req.body.name;
  res.json({ success: true, id });
});

// DELETE PRODUCT
app.delete('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });
  if (products[index].ownerId !== req.session.userId) return res.status(403).json({ error: 'Unauthorized' });

  products.splice(index, 1);
  res.json({ success: true, id });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
