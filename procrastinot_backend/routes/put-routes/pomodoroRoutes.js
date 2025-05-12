const express = require("express");
const router = express.Router();
const PomodoroSession = require("../../models/PomodoroSession");

// Update a pomodoro session by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedSession = await PomodoroSession.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedSession);
  } catch (err) {
    res.status(500).json({ error: "Failed to update pomodoro session." });
  }
});

module.exports = router;
