const sessions = {};

// Create a new session
const createSession = (sessionId, client) => {
  sessions[sessionId] = {
    client,
    messages: []
  };
  console.log(`Session ${sessionId} created.`);
};

// Store message in session
const addMessageToSession = (sessionId, message) => {
  if (sessions[sessionId]) {
    sessions[sessionId].messages.push(message);
  } else {
    console.error(`Session ${sessionId} not found.`);
  }
};

// Get messages from a session
const getSessionMessages = (sessionId) => {
  return sessions[sessionId] ? sessions[sessionId].messages : [];
};

// End a session
const endSession = (sessionId) => {
  if (sessions[sessionId]) {
    delete sessions[sessionId];
    console.log(`Session ${sessionId} ended.`);
  } else {
    console.error(`Session ${sessionId} not found.`);
  }
};

module.exports = {
  createSession,
  addMessageToSession,
  getSessionMessages,
  endSession
};
