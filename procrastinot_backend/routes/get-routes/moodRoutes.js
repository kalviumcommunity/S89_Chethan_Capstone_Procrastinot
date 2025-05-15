//routes/get-routes/moodRoutes.js
const express = require("express");
const router = express.Router();
const MoodLog = require("../../models/MoodLog");

// ✅ Get all mood logs for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const moods = await MoodLog.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(moods);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch mood logs." });
  }
});

module.exports = router;
