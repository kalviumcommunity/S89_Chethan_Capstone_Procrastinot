//routes/get-routes/pomodoroRoutes.js
const express = require("express");
const router = express.Router();
const PomodoroSession = require("../../models/PomodoroSession");

// ✅ Get all pomodoro sessions for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const sessions = await PomodoroSession.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pomodoro sessions." });
  }
});

module.exports = router;
