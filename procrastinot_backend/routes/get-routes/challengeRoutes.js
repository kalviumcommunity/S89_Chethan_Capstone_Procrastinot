const express = require("express");
const router = express.Router();
const Challenge = require("../../models/Challenge");

// ✅ Get all challenges
router.get("/", async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .populate('participants.user')
      .populate('tasks');
    
    if (!challenges || challenges.length === 0) {
      return res.status(404).json({
        message: 'No challenges found',
        error: 'NOT_FOUND'
      });
    }

    res.status(200).json({
      message: 'Challenges retrieved successfully',
      count: challenges.length,
      challenges: challenges
    });
  } catch (err) {
    console.error('Challenge fetch error:', err);
    res.status(500).json({
      message: 'Failed to fetch challenges',
      error: err.message || 'Internal server error'
    });
  }
});

// ✅ Get challenge by difficulty
router.get("/difficulty/:level", async (req, res) => {
  try {
    const { level } = req.params;
    const validLevels = ['Easy', 'Medium', 'Hard'];

    if (!validLevels.includes(level)) {
      return res.status(400).json({
        message: 'Invalid difficulty level',
        error: 'VALIDATION_ERROR',
        validLevels
      });
    }

    const challenges = await Challenge.find({ difficulty: level });
    
    if (!challenges || challenges.length === 0) {
      return res.status(404).json({
        message: `No challenges found for difficulty level: ${level}`,
        error: 'NOT_FOUND'
      });
    }

    res.status(200).json({
      message: 'Challenges retrieved successfully',
      count: challenges.length,
      challenges: challenges
    });
  } catch (err) {
    console.error('Challenge fetch error:', err);
    res.status(500).json({
      message: 'Failed to fetch challenges by difficulty',
      error: err.message || 'Internal server error'
    });
  }
});

module.exports = router;
