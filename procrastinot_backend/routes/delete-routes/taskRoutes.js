const express = require("express");
const router = express.Router();
const Task = require("../../models/Task");
const User = require("../../models/User");

router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findById(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({
        message: 'Task not found',
        error: 'NOT_FOUND'
      });
    }

    // Remove task from user's tasks array
    await User.findByIdAndUpdate(
      deletedTask.userId,
      { $pull: { tasks: deletedTask._id } }
    );

    // Delete the task
    await deletedTask.remove();

    res.status(200).json({
      message: 'Task deleted successfully',
      taskId: req.params.id
    });
  } catch (err) {
    console.error('Task deletion error:', err);
    res.status(500).json({
      message: 'Failed to delete task',
      error: err.message || 'Internal server error'
    });
  }
});

module.exports = router;
