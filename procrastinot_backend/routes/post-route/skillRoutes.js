//routes/post-route/skillRoutes.js
const express = require('express');
const Skill = require('../../models/Skill');
const router = express.Router();

// POST: Create a new skill
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      name,
      description,
      category,
      subTopic,
      level,
      progress,
      streak,
      lastStudiedAt,
      aiSuggestions,
      content // changed from lessonContent
    } = req.body;

    // Validate required fields
    if (!userId || !name || !category || !subTopic) {
      return res.status(400).json({ message: 'userId, name, category, and subTopic are required' });
    }

    const newSkill = new Skill({
      userId,
      name,
      description,
      category,
      subTopic,
      level,
      progress: progress || 0,
      streak: streak || 0,
      lastStudiedAt,
      aiSuggestions,
      content, // changed from lessonContent
    });

    await newSkill.save();
    res.status(201).json({ message: 'Skill created successfully ✅', skill: newSkill });

  } catch (err) {
    res.status(500).json({ message: 'Failed to create skill ❌', error: err.message });
  }
});

module.exports = router;
