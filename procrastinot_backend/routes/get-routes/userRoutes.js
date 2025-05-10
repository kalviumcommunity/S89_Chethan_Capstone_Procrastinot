const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// ✅ Get all users (for admin or testing)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

module.exports = router;
