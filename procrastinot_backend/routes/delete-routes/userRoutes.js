const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Task = require("../../models/Task");
const Skill = require("../../models/Skill");
const SkillProgress = require("../../models/SkillProgress");
const PomodoroSession = require("../../models/PomodoroSession");
const MoodLog = require("../../models/MoodLog");

// ✅ Delete a user by ID
router.delete("/:id", async (req, res) => {
  try {
    // First, delete all related data
    await Task.deleteMany({ userId: req.params.id });
    await Skill.deleteMany({ userId: req.params.id });
    await SkillProgress.deleteMany({ userId: req.params.id });
    await PomodoroSession.deleteMany({ userId: req.params.id });
    await MoodLog.deleteMany({ userId: req.params.id });
    
    // Then delete the user
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json({ message: "User and all related data deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user and related data." });
  }
});

module.exports = router;
