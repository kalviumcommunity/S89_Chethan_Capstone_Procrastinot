const express = require("express");
const router = express.Router();
const MoodLog = require("../../models/MoodLog");

router.delete("/:id", async (req, res) => {
  try {
    const deletedMood = await MoodLog.findByIdAndDelete(req.params.id);
    if (!deletedMood) return res.status(404).json({ error: "Mood log not found." });
    res.status(200).json({ message: "Mood log deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete mood log." });
  }
});

module.exports = router;
