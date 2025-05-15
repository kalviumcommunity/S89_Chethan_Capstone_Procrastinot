//routes/get-routes/userRoutes.js
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
      count: users.length,
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

// ✅ Get user by ID

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
     .select("-password")
     .populate('tasks')
     .populate('skills')
     .populate('skillProgress')
     .populate('pomodoroSessions')
     .populate('moodLogs')
     .populate('completedChallenges');
     if (!user) {
       return res.status(404).json({
        message: 'User not found',
        error: 'NOT_FOUND'
      });
    }
    res.status(200).json({
      message: 'User retrieved successfully',
      user: user
    });
    } catch (err) {
      console.error('User fetch error:', err);
      res.status(500).json({
        message: 'Failed to fetch user',
        error: err.message || 'Internal server error'
      });
    }
  });


module.exports = router;
