//routes/post-route/skillProgressRoutes.js
const express = require('express');
const SkillProgress = require('../../models/SkillProgress');
const router = express.Router();

// POST: Add new skill progress
router.post('/', async (req, res) => {
  try {
    const { userId, skillId, subtopic, progress, streak, lastStudiedAt } = req.body;

    // Basic validation
    if (!userId || !skillId || !subtopic) {
      return res.status(400).json({ message: 'userId, skillId, and subtopic are required' });
    }

    const newProgress = new SkillProgress({
      userId,
      skillId,
      subtopic,
      progress,
      streak,
      lastStudiedAt,
    });

    await newProgress.save();
    res.status(201).json({ message: 'Skill progress logged successfully ✅', progress: newProgress });

  } catch (err) {
    res.status(500).json({ message: 'Failed to log skill progress ❌', error: err.message });
  }
});

module.exports = router;
