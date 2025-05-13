//post-route/taskRoutes.js
const express = require('express');
const Task = require('../../models/Task');
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
      attachmentURL,
    } = req.body;

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
      attachmentURL,
    });

    const savedTask = await newTask.save();

    // Update user's tasks array
    await User.findByIdAndUpdate(
      userId,
      { $push: { tasks: savedTask._id } }
    );

    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task." });
  }
});

module.exports = router;
