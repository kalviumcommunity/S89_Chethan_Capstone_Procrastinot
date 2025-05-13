const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// ✅ Update a user by ID
router.put("/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        message: 'User ID is required',
        error: 'VALIDATION_ERROR'
      });
    }

    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({
        message: 'User not found',
        error: 'NOT_FOUND'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('User update error:', err);
    res.status(500).json({
      message: 'Failed to update user',
      error: err.message || 'Internal server error'
    });
  }
});

module.exports = router;
