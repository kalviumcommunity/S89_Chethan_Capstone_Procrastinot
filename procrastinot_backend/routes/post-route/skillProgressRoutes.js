//routes/post-route/skillProgressRoutes.js
const express = require('express');
const SkillProgress = require('../../models/SkillProgress');
const router = express.Router();

// POST: Add new skill progress
router.post('/', async (req, res) => {
  try {
    const { userId, skillName, subTopic, progress, streak, lastAccessed, aiSuggestions } = req.body;

    // Basic validation
    if (!userId || !skillName || !subTopic) {
      return res.status(400).json({ message: 'userId, skillName, and subTopic are required' });
    }

    const newProgress = new SkillProgress({
      userId,
      skillName,
      subTopic,
      progress,
      streak,
      lastAccessed,
      aiSuggestions,
    });

    await newProgress.save();
    res.status(201).json({ message: 'Skill progress logged successfully ✅', progress: newProgress });

  } catch (err) {
    res.status(500).json({ message: 'Failed to log skill progress ❌', error: err.message });
  }
});

module.exports = router;
