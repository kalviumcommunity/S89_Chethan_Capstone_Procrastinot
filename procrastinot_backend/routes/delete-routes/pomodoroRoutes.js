const express = require("express");
const router = express.Router();
const PomodoroSession = require("../../models/PomodoroSession");

router.delete("/:id", async (req, res) => {
  try {
    const deletedSession = await PomodoroSession.findByIdAndDelete(req.params.id);
    if (!deletedSession) return res.status(404).json({ error: "Pomodoro session not found." });
    res.status(200).json({ message: "Pomodoro session deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete Pomodoro session." });
  }
});

module.exports = router;
