//routes/post-route/taskRoutes.js
const express = require('express');
const Task = require('../../models/Task');
const User = require('../../models/User');
const router = express.Router();

// POST: Create a new task
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      title,
      description,
      status,
      relatedSkills,
      challenge,
      moodBefore,
      pomodoroCount,
      aiBreakdown,
      attachmentUrl, // changed from attachmentURL
    } = req.body;

    // Required field validation
    if (!userId || !title) {
      return res.status(400).json({
        message: 'User ID and title are required fields',
        error: 'VALIDATION_ERROR'
      });
    }

    // Validate if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    const newTask = new Task({
      userId,
      title,
      description,
      status,
      relatedSkills,
      challenge,
      moodBefore,
      pomodoroCount,
      aiBreakdown,
      attachmentUrl, // changed from attachmentURL
    });

    const savedTask = await newTask.save();

    // Update user's tasks array
    await User.findByIdAndUpdate(
      userId,
      { $push: { tasks: savedTask._id } }
    );

    res.status(201).json({
      message: 'Task created successfully',
      task: savedTask
    });
  } catch (err) {
    console.error('Task creation error:', err);
    res.status(500).json({
      message: 'Failed to create task',
      error: err.message || 'Internal server error'
    });
  }
});

module.exports = router;
