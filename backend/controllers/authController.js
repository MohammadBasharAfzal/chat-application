const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authController = {
  // Register new users
  register: (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    User.findByUsername(username, (err, user) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (user) return res.status(400).json({ message: 'Username already exists' });

      // Create new user
      User.create(username, password, (err, newUser) => {
        if (err) return res.status(500).json({ message: 'Error registering user' });
        res.status(201).json({ message: 'User registered successfully', user: newUser });
      });
    });
  },

  // Login existing users
  login: (req, res) => {
    const { username, password } = req.body;

    // Find user by username
    User.findByUsername(username, (err, user) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (!user) return res.status(400).json({ message: 'Invalid username or password' });

      // Verify password
      User.verifyPassword(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

        // Generate JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
      });
    });
  },

  // Logout user
  logout: (req, res) => {
    // Invalidate the token (on the client-side, it should be removed from storage)
    res.json({ message: 'Logout successful' });
  }
};

module.exports = authController;
