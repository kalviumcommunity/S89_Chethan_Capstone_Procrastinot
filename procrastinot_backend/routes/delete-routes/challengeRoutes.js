const express = require("express");
const router = express.Router();
const Challenge = require("../../models/Challenge");

router.delete("/:id", async (req, res) => {
  try {
    const deletedChallenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!deletedChallenge) return res.status(404).json({ error: "Challenge not found." });
    res.status(200).json({ message: "Challenge deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete challenge." });
  }
});

module.exports = router;
