//routes/post-route/challengeRoutes.js
const express = require('express');
const Challenge = require('../../models/Challenge');
const router = express.Router();

// POST: Create a new challenge
router.post('/', async (req, res) => {
  try {
    const { title, description, difficulty, tags, validFor } = req.body;

    // Basic validation
    if (!title || !description || !difficulty) {
      return res.status(400).json({ message: 'Title, description, and difficulty are required' });
    }

    const newChallenge = new Challenge({
      title,
      description,
      difficulty,
      tags,
      validFor, // Optional - defaults to 24hrs in schema
    });

    await newChallenge.save();
    res.status(201).json({ message: 'Challenge created successfully ✅', challenge: newChallenge });

  } catch (err) {
    res.status(500).json({ message: 'Failed to create challenge ❌', error: err.message });
  }
});

module.exports = router;
