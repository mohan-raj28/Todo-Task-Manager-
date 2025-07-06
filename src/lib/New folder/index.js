require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'todo_db',
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Simple test route
app.get('/', (req, res) => {
  res.send('Todo Task Manager API is running');
});

// --- User Registration ---
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email already exists' });
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: result.insertId, name, email });
  });
});

// --- User Login ---
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = results[0];
    res.json({ id: user.id, name: user.name, email: user.email });
  });
});

// --- CRUD for Tasks ---
// Get all tasks for a user
app.get('/api/tasks', (req, res) => {
  const userId = req.query.userId;
  db.query('SELECT * FROM tasks WHERE user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Create a new task
app.post('/api/tasks', (req, res) => {
  const { user_id, title, description, status, priority, due_date } = req.body;
  db.query(
    'INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?)',
    [user_id, title, description, status, priority, due_date],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json({ id: result.insertId, user_id, title, description, status, priority, due_date });
    }
  );
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
  const { title, description, status, priority, due_date } = req.body;
  db.query(
    'UPDATE tasks SET title=?, description=?, status=?, priority=?, due_date=? WHERE id=?',
    [title, description, status, priority, due_date, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ success: true });
    }
  );
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  db.query('DELETE FROM tasks WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
