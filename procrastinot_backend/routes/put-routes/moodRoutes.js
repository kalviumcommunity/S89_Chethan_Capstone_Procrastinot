const express = require("express");
const router = express.Router();
const MoodLog = require("../../models/MoodLog");

// Update a mood log entry by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedMood = await MoodLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedMood);
  } catch (err) {
    res.status(500).json({ error: "Failed to update mood log." });
  }
});

module.exports = router;
