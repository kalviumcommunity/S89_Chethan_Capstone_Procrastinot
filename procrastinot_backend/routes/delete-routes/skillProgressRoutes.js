const express = require("express");
const router = express.Router();
const SkillProgress = require("../../models/SkillProgress");

router.delete("/:id", async (req, res) => {
  try {
    const deletedProgress = await SkillProgress.findById(req.params.id);
    if (!deletedProgress) return res.status(404).json({ error: "Progress not found." });

    // Remove from user's skillProgress array
    const User = require("../../models/User");
    await User.findByIdAndUpdate(
      deletedProgress.userId,
      { $pull: { skillProgress: deletedProgress._id } }
    );

    await SkillProgress.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Skill progress deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete skill progress." });
  }
});

module.exports = router;
