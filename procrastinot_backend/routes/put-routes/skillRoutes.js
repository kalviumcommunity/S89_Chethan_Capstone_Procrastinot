const express = require("express");
const router = express.Router();
const Skill = require("../../models/Skill");

// ✅ Update a skill by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedSkill);
  } catch (err) {
    res.status(500).json({ error: "Failed to update skill." });
  }
});

module.exports = router;
