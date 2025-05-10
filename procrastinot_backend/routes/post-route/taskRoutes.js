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
      moodBefore,
      pomodoroCount,
      aiBreakdown,
      attachmentURL,
    } = req.body;

    // Validate required fields
    if (!userId || !title) {
      return res.status(400).json({ message: 'userId and title are required' });
    }

    const newTask = new Task({
      userId,
      title,
      description,
      status: status || 'Pending',
      moodBefore,
      pomodoroCount: pomodoroCount || 0,
      aiBreakdown,
      attachmentURL,
    });

    await newTask.save();
    res.status(201).json({ message: 'Task created successfully ✅', task: newTask });

  } catch (err) {
    res.status(500).json({ message: 'Failed to create task ❌', error: err.message });
  }
});

module.exports = router;
