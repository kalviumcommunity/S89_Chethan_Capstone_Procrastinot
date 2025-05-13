const express = require("express");
const router = express.Router();
const Task = require("../../models/Task");

// ✅ Get all tasks for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId })
      .populate('relatedSkills')
      .populate('challenge')
      .populate('pomodoroSessions');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks." });
  }
});

// ✅ Get single task by ID
router.get("/:taskId", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate('relatedSkills')
      .populate('challenge')
      .populate('pomodoroSessions');
    if (!task) return res.status(404).json({ error: "Task not found." });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: "Error fetching task." });
  }
});

module.exports = router;
