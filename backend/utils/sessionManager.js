const sessions = {};

// Create a new session and associate it with a userId
const createSession = (sessionId, userId) => {
  sessions[sessionId] = {
    userId,  // Store userId in session
    messages: []
  };
  console.log(`Session ${sessionId} created for user ${userId}.`);
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

// Function to get userId by sessionId
const getUserId = (sessionId) => {
  return sessions[sessionId] ? sessions[sessionId].userId : null; // Return userId if session exists
};

module.exports = {
  createSession,
  addMessageToSession,
  getSessionMessages,
  endSession,
  getUserId
};
