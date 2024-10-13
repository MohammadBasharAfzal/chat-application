const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  // Find user by username
  findByUsername: (username, callback) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], (err, row) => {
      if (err) {
        return callback(err);
      }
      callback(null, row);
    });
  },

  // Register new user
  create: (username, password, callback) => {
    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return callback(err);

      // Insert user into the database
      const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
      db.run(sql, [username, hash], function (err) {
        if (err) {
          return callback(err);
        }
        callback(null, { id: this.lastID, username });
      });
    });
  },

  // Verify user credentials
  verifyPassword: (password, hash, callback) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  }
};

module.exports = User;
