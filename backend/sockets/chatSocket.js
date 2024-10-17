const WebSocket = require('ws');
const db = require('../config/db');
const sessionManager = require('../utils/sessionManager'); // Session management

// WebSocket server setup
const setupWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    // Listen for incoming messages from client
    ws.on('message', (message) => {
      try {
        // Parse the received message as JSON
        const parsedMessage = JSON.parse(message);
        const { text, sessionId } = parsedMessage;

        console.log('Received message:', text, 'from session:', sessionId);

        // Echo the message back to the client in JSON format
        ws.send(JSON.stringify({ sessionId, text: `Echo: ${text}` }));

        // Get user ID based on session ID
        const userId = sessionManager.getUserId(sessionId);

        if (userId) {
          // Save the message to the chat_sessions table
          db.run(
            `INSERT INTO chat_sessions (user_id, message) VALUES (?, ?)`,
            [userId, text],
            (err) => {
              if (err) {
                console.error('Error saving message to the database:', err.message);
              } else {
                console.log('Message saved to the database for user:', userId);
              }
            }
          );
        } else {
          console.error('Invalid session or user ID');
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    // Handle WebSocket closing
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });
};

module.exports = setupWebSocketServer;
