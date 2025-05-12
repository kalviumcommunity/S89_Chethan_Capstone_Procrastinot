const express = require("express");
const router = express.Router();
const Skill = require("../../models/Skill");

router.delete("/:id", async (req, res) => {
  try {
    const deletedSkill = await Skill.findByIdAndDelete(req.params.id);
    if (!deletedSkill) return res.status(404).json({ error: "Skill not found." });
    res.status(200).json({ message: "Skill deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete skill." });
  }
});

module.exports = router;
