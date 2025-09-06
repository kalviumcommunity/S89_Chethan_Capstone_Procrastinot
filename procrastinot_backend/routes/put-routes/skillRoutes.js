const express = require("express");
const router = express.Router();
const Skill = require("../../models/Skill");

// ✅ Update a skill by ID
router.put("/:id", async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ error: "Skill not found." });
    if (skill.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Forbidden: You do not own this skill." });
    }
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedSkill);
  } catch (err) {
    res.status(500).json({ error: "Failed to update skill." });
  }
});

module.exports = router;
