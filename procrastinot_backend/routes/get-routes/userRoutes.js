//get-routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// ✅ Get all users (for admin or testing)
router.get("/", async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate('tasks')
      .populate('skills')
      .populate('skillProgress')
      .populate('pomodoroSessions')
      .populate('moodLogs')
      .populate('completedChallenges');
    
    if (!users || users.length === 0) {
      return res.status(404).json({
        message: 'No users found',
        error: 'NOT_FOUND'
      });
    }

    res.status(200).json({
      message: 'Users retrieved successfully',
      users: users
    });
  } catch (err) {
    console.error('User fetch error:', err);
    res.status(500).json({
      message: 'Failed to fetch users',
      error: err.message || 'Internal server error'
    });
  }
});

module.exports = router;
