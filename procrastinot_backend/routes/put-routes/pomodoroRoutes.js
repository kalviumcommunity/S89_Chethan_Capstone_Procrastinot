const express = require("express");
const router = express.Router();
const PomodoroSession = require("../../models/PomodoroSession");

// ✅ Update a pomodoro session by ID
router.put("/:id", async (req, res) => {
  try {
    const session = await PomodoroSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: "Pomodoro session not found." });
    if (session.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Forbidden: You do not own this pomodoro session." });
    }
    const updatedSession = await PomodoroSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedSession);
  } catch (err) {
    res.status(500).json({ error: "Failed to update pomodoro session." });
  }
});

module.exports = router;
