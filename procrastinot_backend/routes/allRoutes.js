const express = require("express");
const router = express.Router();

// GET Routes
const userGetRoutes = require("./get-routes/userRoutes");
const taskGetRoutes = require("./get-routes/taskRoutes");
const skillGetRoutes = require("./get-routes/skillRoutes");
const skillProgressGetRoutes = require("./get-routes/skillProgressRoutes");
const moodGetRoutes = require("./get-routes/moodRoutes");
const challengeGetRoutes = require("./get-routes/challengeRoutes");
const pomodoroGetRoutes = require("./get-routes/pomodoroRoutes");

// POST Routes
const userPostRoutes = require("./post-route/userRoutes");
const taskPostRoutes = require("./post-route/taskRoutes");
const skillPostRoutes = require("./post-route/skillRoutes");
const skillProgressPostRoutes = require("./post-route/skillProgressRoutes");
const moodPostRoutes = require("./post-route/moodRoutes");
const challengePostRoutes = require("./post-route/challengeRoutes");
const pomodoroPostRoutes = require("./post-route/pomodoroRoutes");

// Mount GET routes
router.use("/users", userGetRoutes);
router.use("/tasks", taskGetRoutes);
router.use("/skills", skillGetRoutes);
router.use("/skill-progress", skillProgressGetRoutes);
router.use("/moods", moodGetRoutes);
router.use("/challenges", challengeGetRoutes);
router.use("/pomodoro", pomodoroGetRoutes);

// Mount POST routes
router.use("/users", userPostRoutes);
router.use("/tasks", taskPostRoutes);
router.use("/skills", skillPostRoutes);
router.use("/skill-progress", skillProgressPostRoutes);
router.use("/moods", moodPostRoutes);
router.use("/challenges", challengePostRoutes);
router.use("/pomodoro", pomodoroPostRoutes);

module.exports = router;
