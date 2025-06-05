//routes/post-route/pomodoroRoutes.js
const express = require('express');
const PomodoroSession = require('../../models/PomodoroSession');
const router = express.Router();

// POST: Create a new Pomodoro session
router.post('/', async (req, res) => {
  try {
    const { userId, taskId, duration, status, moodBefore, moodAfter, startTime, endTime } = req.body;

    if (!userId || !duration || !status) {
      return res.status(400).json({ message: 'userId, duration, and status are required' });
    }

    const newSession = new PomodoroSession({
      userId,
      taskId,
      duration,
      status,
      moodBefore,
      moodAfter,
      startTime: startTime || Date.now(),
      endTime: endTime || null,
    });

    await newSession.save();
    res.status(201).json({ message: 'Pomodoro session logged successfully ✅', session: newSession });

  } catch (err) {
    res.status(500).json({ message: 'Failed to log Pomodoro session ❌', error: err.message });
  }
});

module.exports = router;
