//get-routes/skillProgressRoutes.js
const express = require("express");
const router = express.Router();
const SkillProgress = require("../../models/SkillProgress");

// ✅ Get skill progress for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const progress = await SkillProgress.find({ userId: req.params.userId });
    res.status(200).json(progress);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch skill progress." });
  }
});

module.exports = router;
