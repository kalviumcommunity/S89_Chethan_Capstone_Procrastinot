const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const router = express.Router();

// POST: Signup a new user
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, googleId } = req.body;

    // Ensure either password or googleId is provided (but not both)
    if ((!password && !googleId) || (password && googleId)) {
      return res.status(400).json({ message: 'Provide either password or Google ID' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'User already exists' });

    // Hash password if provided
    let hashedPassword = '';
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword || undefined,
      googleId: googleId || undefined,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully ✅' });

  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

// POST: Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful ✅', userId: user._id });

  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

module.exports = router;
