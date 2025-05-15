//routes/get-routes/skillRoutes.js
const express = require("express");
const router = express.Router();
const Skill = require("../../models/Skill");

// ✅ Get all skills
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.status(200).json({
      message: "Skills retrieved successfully",
      count: skills.length,
      skills: skills
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch skills." });
  }
});

// ✅ Get skills by category
router.get("/category/:category", async (req, res) => {
  try {
    const skills = await Skill.find({ category: req.params.category });
    res.status(200).json({
      message: "Skills retrieved by category",
      count: skills.length,
      skills: skills
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching skills by category." });
  }
});

module.exports = router;
