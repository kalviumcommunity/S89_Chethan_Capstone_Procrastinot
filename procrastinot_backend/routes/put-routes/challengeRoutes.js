const express = require("express");
const router = express.Router();
const Challenge = require("../../models/Challenge");

// Update a challenge by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedChallenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedChallenge);
  } catch (err) {
    res.status(500).json({ error: "Failed to update challenge." });
  }
});

module.exports = router;
