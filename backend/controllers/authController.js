const jwt = require('jsonwebtoken');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// JWT secret
const JWT_SECRET = 'your_jwt_secret'; // Ensure this is a strong secret in production

const authController = {
  // Register new users
  register: (req, res) => {
    const { username, password } = req.body;

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Check if user already exists
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (user) return res.status(400).json({ message: 'Username already exists' });

      // Create new user
      db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function(err) {
        if (err) return res.status(500).json({ message: 'Error registering user' });
        res.status(201).json({ message: 'User registered successfully', user: { id: this.lastID, username } });
      });
    });
  },

  // Login existing users
  login: (req, res) => {
    const { username, password } = req.body;

    // Find user by username
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (!user) return res.status(400).json({ message: 'Invalid username or password' });

      // Verify password
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) return res.status(400).json({ message: 'Invalid username or password' });

      // Generate JWT token
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    });
  },

  // Logout user
  logout: (req, res) => {
    // Invalidate the token (on the client-side, it should be removed from storage)
    res.json({ message: 'Logout successful' });
  }
};

module.exports = authController;
