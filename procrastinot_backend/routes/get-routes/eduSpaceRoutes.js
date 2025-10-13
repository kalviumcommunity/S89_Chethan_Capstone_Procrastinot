const express = require('express');
const router = express.Router();

// Placeholder for future GET routes
router.get('/history', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;