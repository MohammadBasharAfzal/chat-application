const express = require('express');
const http = require('http');
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
app.use(express.static(path.join(__dirname, '../frontend/views')));

// WebSocket server setup
setupWebSocketServer(server);

// Connect to the SQLite database
db.serialize(() => {
  // Create users table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  // Create chat_sessions table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  console.log('Connected to the SQLite database and ensured user and chat_sessions tables exist.');
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
