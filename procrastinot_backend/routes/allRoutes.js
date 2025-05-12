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

// PUT Routes
const userPutRoutes = require("./put-routes/userRoutes");
const taskPutRoutes = require("./put-routes/taskRoutes");
const skillPutRoutes = require("./put-routes/skillRoutes");
const skillProgressPutRoutes = require("./put-routes/skillProgressRoutes");
const moodPutRoutes = require("./put-routes/moodRoutes");
const challengePutRoutes = require("./put-routes/challengeRoutes");
const pomodoroPutRoutes = require("./put-routes/pomodoroRoutes");

// DELETE Routes
const userDeleteRoutes = require("./delete-routes/userRoutes");
const taskDeleteRoutes = require("./delete-routes/taskRoutes");
const skillDeleteRoutes = require("./delete-routes/skillRoutes");
const skillProgressDeleteRoutes = require("./delete-routes/skillProgressRoutes");
const moodDeleteRoutes = require("./delete-routes/moodRoutes");
const challengeDeleteRoutes = require("./delete-routes/challengeRoutes");
const pomodoroDeleteRoutes = require("./delete-routes/pomodoroRoutes");

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


// Mount PUT routes
router.use("/users", userPutRoutes);
router.use("/tasks", taskPutRoutes);
router.use("/skills", skillPutRoutes);
router.use("/skill-progress", skillProgressPutRoutes);
router.use("/moods", moodPutRoutes);
router.use("/challenges", challengePutRoutes);
router.use("/pomodoro", pomodoroPutRoutes);

// Mount DELETE routes
router.use("/users", userDeleteRoutes);
router.use("/tasks", taskDeleteRoutes);
router.use("/skills", skillDeleteRoutes);
router.use("/skill-progress", skillProgressDeleteRoutes);
router.use("/moods", moodDeleteRoutes);
router.use("/challenges", challengeDeleteRoutes);
router.use("/pomodoro", pomodoroDeleteRoutes);

module.exports = router;
