const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// Get current user profile (simpler route)
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
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

// ✅ FIXED: Get user by ID — updated route to avoid conflict with '/register' (Protected route)
router.get("/profile/:userId", async (req, res) => {
  try {
    // Ensure the user can only access their own profile
    if (req.params.userId !== req.user.id && req.params.userId !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied", error: "FORBIDDEN" });
    }

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
