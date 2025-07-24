const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth'); // We'll use this for the /me route

// @route    POST /api/users
// @desc     Register a new user
// @access   Public
router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate request
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }

    // Check if user already exists by email
    let existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ 
        error: 'User with this email already exists' 
      });
    }

    // Check if username is already taken
    let existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ 
        error: 'Username is already taken' 
      });
    }

    // Create new user
    const user = new User({ username, email, password });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();
    
    // On successful registration, just send a success message.
    // Let the user log in separately.
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error('Registration error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists by email
    const user = await User.findOne({ email });
    if (!user) {
      // Use a generic error message for security
      return res.status(401).json({ error: 'Invalid Credentials' });
    }

    // 2. Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid Credentials' });
    }

    // 3. If passwords match, create JWT payload
    const payload = {
      user: {
        id: user.id,
        username: user.username // Include username for frontend display
      }
    };

    // 4. Sign the token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        // 5. Send token and user info back to the client
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


// @route    GET /api/users/me
// @desc     Get current user's data (useful for session persistence)
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    // req.user.id is set by the auth middleware from the token
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});


module.exports = router;