const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'livrai',
});

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide' });
  }
};

// Auth
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }
  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '24h' }
  );
  res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});

// Users
app.get('/api/users', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Accès refusé' });
  const [rows] = await db.query("SELECT id, name, email FROM users WHERE role = 'client'");
  res.json(rows);
});

app.post('/api/users', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Accès refusé' });
  const { email, name, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await db.query(
    "INSERT INTO users (email, name, password, role) VALUES (?, ?, ?, 'client')",
    [email, name, hashed]
  );
  res.status(201).json({ message: 'Client créé' });
});

// Deliveries
app.get('/api/deliveries', authenticate, async (req, res) => {
  let rows;
  if (req.user.role === 'admin') {
    [rows] = await db.query('SELECT * FROM deliveries ORDER BY id DESC');
  } else {
    [rows] = await db.query(
      'SELECT * FROM deliveries WHERE userId = ? ORDER BY id DESC',
      [req.user.id]
    );
  }
  res.json(rows);
});

app.post('/api/deliveries', authenticate, async (req, res) => {
  if (req.user.role !== 'client') return res.status(403).json({ error: 'Accès refusé' });
  const { volume, weight } = req.body;
  await db.query(
    "INSERT INTO deliveries (userId, volume, weight, status, clientName) VALUES (?, ?, ?, 'En attente', ?)",
    [req.user.id, volume, weight, req.user.name]
  );
  res.status(201).json({ message: 'Livraison créée' });
});

app.put('/api/deliveries/:id', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Accès refusé' });
  const { status, price } = req.body;
  await db.query(
    'UPDATE deliveries SET status = ?, price = ? WHERE id = ?',
    [status, price ?? null, req.params.id]
  );
  res.json({ message: 'Livraison mise à jour' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
