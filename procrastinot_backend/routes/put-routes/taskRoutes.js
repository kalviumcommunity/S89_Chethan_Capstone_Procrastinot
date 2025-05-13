const express = require("express");
const router = express.Router();
const Task = require("../../models/Task");

// ✅ Update a task by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task." });
  }
});

module.exports = router;
