const WebSocket = require('ws');
const db = require('../config/db');
const sessionManager = require('../utils/sessionManager'); // Session management

// Helper function to generate a unique session ID (for example purposes)
const generateSessionId = () => {
  return `session_${Math.random().toString(36).substr(2, 9)}`;
};

// WebSocket server setup
const setupWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    // When a client connects, assign a sessionId and create a session
    const sessionId = generateSessionId();
    const userId = 'user1'; // This should be dynamically retrieved, e.g., from login credentials
    sessionManager.createSession(sessionId, userId); // Create a session with userId

    // Send sessionId back to the client (if needed)
    ws.send(JSON.stringify({ message: 'Welcome!', sessionId }));

    // Listen for incoming messages from client
    ws.on('message', (message) => {
      try {
        // Parse the received message as JSON
        const parsedMessage = JSON.parse(message);
        const { text, sessionId } = parsedMessage;

        console.log('Received message:', text, 'from session:', sessionId);

        // Echo the message back to the client in JSON format
        ws.send(JSON.stringify({ sessionId, text: `Server: ${text}` }));

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

          // Store the message in the session
          sessionManager.addMessageToSession(sessionId, text);
        } else {
          console.error('Invalid session or user ID');
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    // Handle WebSocket closing
    ws.on('close', () => {
      console.log(`Client disconnected from WebSocket (session: ${sessionId})`);
      sessionManager.endSession(sessionId); // End the session when WebSocket disconnects
    });
  });
};

module.exports = setupWebSocketServer;
