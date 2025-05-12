const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// Update a user by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user." });
  }
});

module.exports = router;
