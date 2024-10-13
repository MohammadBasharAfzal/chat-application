const WebSocket = require('ws');
const db = require('../config/db'); // Import the database connection

// WebSocket server setup
const setupWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    // Listen for incoming messages from client
    ws.on('message', (message) => {
      console.log('Received message:', message);

      // Echo the message back to the client
      ws.send(`Echo: ${message}`);

      // Optionally, you can store the message in the database
      // Here, we assume the message is just plain text
      const userId = 1; // Replace with actual user ID logic

      // Save the message to the chat_sessions table
      db.run(`INSERT INTO chat_sessions (user_id, message) VALUES (?, ?)`, [userId, message], (err) => {
        if (err) {
          console.error('Error saving message to the database:', err.message);
        } else {
          console.log('Message saved to the database');
        }
      });
    });

    // Handle WebSocket closing
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });
};

module.exports = setupWebSocketServer;
