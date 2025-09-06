const express = require("express");
const router = express.Router();
const MoodLog = require("../../models/MoodLog");

// ✅ Update a mood log by ID
router.put("/:id", async (req, res) => {
  try {
    const mood = await MoodLog.findById(req.params.id);
    if (!mood) return res.status(404).json({ error: "Mood log not found." });
    if (mood.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Forbidden: You do not own this mood log." });
    }
    const updatedMood = await MoodLog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedMood);
  } catch (err) {
    res.status(500).json({ error: "Failed to update mood log." });
  }
});

module.exports = router;
