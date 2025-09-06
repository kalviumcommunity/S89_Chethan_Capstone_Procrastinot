const express = require("express");
const router = express.Router();
const SkillProgress = require("../../models/SkillProgress");

// ✅ Update a skill progress by ID
router.put("/:id", async (req, res) => {
  try {
    const skillProgress = await SkillProgress.findById(req.params.id);
    if (!skillProgress) return res.status(404).json({ error: "Skill progress not found." });
    if (skillProgress.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Forbidden: You do not own this skill progress." });
    }
    const updatedSkillProgress = await SkillProgress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedSkillProgress);
  } catch (err) {
    res.status(500).json({ error: "Failed to update skill progress." });
  }
});

module.exports = router;
