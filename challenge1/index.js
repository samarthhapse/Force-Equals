const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const users = require('./users');
const accounts = require('./accounts');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// POST /login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, authMiddleware.secret, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

// GET /accounts (protected)
app.get('/accounts', authMiddleware, (req, res) => {
  res.json(accounts);
});

// POST /accounts/:id/status (protected)
app.post('/accounts/:id/status', authMiddleware, (req, res) => {
  const accountId = parseInt(req.params.id);
  const { status } = req.body;

  const account = accounts.find(acc => acc.id === accountId);
  if (!account) {
    return res.status(404).json({ message: 'Account not found' });
  }

  account.status = status;
  res.json({ message: 'Status updated', account });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
