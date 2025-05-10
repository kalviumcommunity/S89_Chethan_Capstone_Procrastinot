const express = require("express");
const router = express.Router();

// Import route modules
const userRoutes = require("./get-routes/userRoutes");
const taskRoutes = require("./get-routes/taskRoutes");
const skillRoutes = require("./get-routes/skillRoutes");
const skillProgressRoutes = require("./get-routes/skillProgressRoutes");
const moodRoutes = require("./get-routes/moodRoutes");
const challengeRoutes = require("./get-routes/challengeRoutes");
const pomodoroRoutes = require("./get-routes/pomodoroRoutes");

// Use routes with API path prefixes
router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/skills", skillRoutes);
router.use("/skill-progress", skillProgressRoutes);
router.use("/moods", moodRoutes);
router.use("/challenges", challengeRoutes);
router.use("/pomodoro", pomodoroRoutes);

module.exports = router;
