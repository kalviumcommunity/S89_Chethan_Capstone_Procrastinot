const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// ✅ Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("tasks skills skillProgress pomodoroSessions moodLogs completedChallenges")
      .exec();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found", error: "NOT_FOUND" });
    }

    res.status(200).json({
      message: "Users retrieved successfully",
      count: users.length,
      users,
    });
  } catch (err) {
    console.error("User fetch error:", err);
    res.status(500).json({ message: "Failed to fetch users", error: err.message || "Internal server error" });
  }
});

// ✅ FIXED: Get user by ID — updated route to avoid conflict with '/register'
router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("-password")
      .populate("tasks skills skillProgress pomodoroSessions moodLogs completedChallenges")
      .exec();

    if (!user) {
      return res.status(404).json({ message: "User not found", error: "NOT_FOUND" });
    }

    res.status(200).json({ message: "User retrieved successfully", user });
  } catch (err) {
    console.error("User fetch error:", err);
    res.status(500).json({ message: "Failed to fetch user", error: err.message || "Internal server error" });
  }
});

module.exports = router;
