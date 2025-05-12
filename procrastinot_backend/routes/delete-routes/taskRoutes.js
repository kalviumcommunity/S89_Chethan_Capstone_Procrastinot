const express = require("express");
const router = express.Router();
const Task = require("../../models/Task");

router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ error: "Task not found." });
    res.status(200).json({ message: "Task deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task." });
  }
});

module.exports = router;
