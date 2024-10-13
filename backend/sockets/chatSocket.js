const WebSocket = require('ws');

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
    });

    // Handle WebSocket closing
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });
};

module.exports = setupWebSocketServer;
