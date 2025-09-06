const express = require("express");
const router = express.Router();
const Task = require("../../models/Task");

// ✅ Update a task by ID
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found." });
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Forbidden: You do not own this task." });
    }
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task." });
  }
});

module.exports = router;
