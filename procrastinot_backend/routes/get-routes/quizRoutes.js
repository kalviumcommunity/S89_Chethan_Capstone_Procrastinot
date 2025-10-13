const express = require('express');
const router = express.Router();
const Quiz = require('../../models/Quiz');

// Get user's quiz history
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, userId: req.user.id });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;