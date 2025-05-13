//get-routes/challengeRouter.js
const express = require("express");
const router = express.Router();
const Challenge = require("../../models/Challenge");

// ✅ Get all challenges
router.get("/", async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .populate('participants.user')
      .populate('tasks');
    res.status(200).json(challenges);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch challenges." });
  }
});

// ✅ Get challenge by difficulty
router.get("/difficulty/:level", async (req, res) => {
  try {
    const challenges = await Challenge.find({ difficulty: req.params.level });
    res.status(200).json(challenges);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch challenges by difficulty." });
  }
});

module.exports = router;
