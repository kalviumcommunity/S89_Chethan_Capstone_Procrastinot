const express = require('express');
const Skill = require('../../models/Skill');
const router = express.Router();

// POST: Create a new skill
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      category,
      subTopic,
      progress,
      streak,
      lastStudiedAt,
      aiSuggestions,
      lessonContent
    } = req.body;

    // Validate required fields
    if (!userId || !category || !subTopic) {
      return res.status(400).json({ message: 'userId, category, and subTopic are required' });
    }

    const newSkill = new Skill({
      userId,
      category,
      subTopic,
      progress: progress || 0,
      streak: streak || 0,
      lastStudiedAt,
      aiSuggestions,
      lessonContent,
    });

    await newSkill.save();
    res.status(201).json({ message: 'Skill created successfully ✅', skill: newSkill });

  } catch (err) {
    res.status(500).json({ message: 'Failed to create skill ❌', error: err.message });
  }
});

module.exports = router;
