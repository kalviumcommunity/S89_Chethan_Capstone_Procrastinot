const express = require("express");
const router = express.Router();
const SkillProgress = require("../../models/SkillProgress");

// ✅ Update a skill progress by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedSkillProgress = await SkillProgress.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedSkillProgress);
  } catch (err) {
    res.status(500).json({ error: "Failed to update skill progress." });
  }
});

module.exports = router;
