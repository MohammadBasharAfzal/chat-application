const express = require('express');
const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const setupWebSocketServer = require('./sockets/chatSocket');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const db = require('./config/db');

const app = express();
const server = http.createServer(app);

// Middleware to parse JSON
app.use(express.json());

// Authentication routes
app.use('/api/auth', authRoutes);

// Static files for frontend (if needed later)
app.use(express.static(path.join(__dirname, '../frontend')));

// WebSocket server setup
setupWebSocketServer(server);

// Connect to the SQLite database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);
  console.log('Connected to the SQLite database and ensured user table exists.');
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
