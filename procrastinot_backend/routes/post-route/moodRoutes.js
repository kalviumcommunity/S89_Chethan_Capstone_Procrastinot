//post-route/moodRoutes.js
const express = require('express');
const MoodLog = require('../../models/MoodLog');
const router = express.Router();

// POST: Create a new mood log
router.post('/', async (req, res) => {
  try {
    const { userId, moodType, notes, sessionType } = req.body;

    // Validate required fields
    if (!userId || !moodType || !sessionType) {
      return res.status(400).json({ message: 'userId, moodType, and sessionType are required' });
    }

    const newMoodLog = new MoodLog({
      userId,
      moodType,
      notes,
      sessionType,
    });

    await newMoodLog.save();
    res.status(201).json({ message: 'Mood log created successfully ✅', moodLog: newMoodLog });

  } catch (err) {
    res.status(500).json({ message: 'Failed to create mood log ❌', error: err.message });
  }
});

module.exports = router;
