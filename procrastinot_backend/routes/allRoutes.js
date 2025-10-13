const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // Import JWT middleware

// =========================
// ✅ PUBLIC ROUTES (NO AUTH)
// =========================

// User routes: Register & Login remain public
const userPostRoutes = require("./post-route/userRoutes");
const userGetRoutes = require("./get-routes/userRoutes");

router.use("/users", userPostRoutes); // Register & Login (no auth required)

// ============================
// ✅ PROTECTED ROUTES (AUTH)
// ============================
// Apply authentication ONLY after public routes
router.use(authMiddleware);

// ✅ Authenticated User Routes
router.use("/users", userGetRoutes);  // GET /users and /users/profile/:userId (protected)

// ✅ Authenticated GET Routes
router.use("/tasks", require("./get-routes/taskRoutes"));
router.use("/skills", require("./get-routes/skillRoutes"));
router.use("/skill-progress", require("./get-routes/skillProgressRoutes"));
router.use("/moods", require("./get-routes/moodRoutes"));
router.use("/challenges", require("./get-routes/challengeRoutes"));
router.use("/pomodoro", require("./get-routes/pomodoroRoutes"));
router.use("/chatbot", require("./get-routes/chatbotRoutes"));
router.use("/quiz", require("./get-routes/quizRoutes"));
router.use("/utils", require("./get-routes/utilsRoutes"));

// ✅ Authenticated POST Routes
router.use("/tasks", require("./post-route/taskRoutes"));
router.use("/skills", require("./post-route/skillRoutes"));
router.use("/skill-progress", require("./post-route/skillProgressRoutes"));
router.use("/moods", require("./post-route/moodRoutes"));
router.use("/challenges", require("./post-route/challengeRoutes"));
router.use("/pomodoro", require("./post-route/pomodoroRoutes"));
router.use("/chatbot", require("./post-route/chatbotRoutes"));
router.use("/quiz", require("./post-route/quizRoutes"));

// ✅ Authenticated PUT Routes
router.use("/users", require("./put-routes/userRoutes"));
router.use("/tasks", require("./put-routes/taskRoutes"));
router.use("/skills", require("./put-routes/skillRoutes"));
router.use("/skill-progress", require("./put-routes/skillProgressRoutes"));
router.use("/moods", require("./put-routes/moodRoutes"));
router.use("/challenges", require("./put-routes/challengeRoutes"));
router.use("/pomodoro", require("./put-routes/pomodoroRoutes"));

// ✅ Authenticated DELETE Routes
router.use("/users", require("./delete-routes/userRoutes"));
router.use("/tasks", require("./delete-routes/taskRoutes"));
router.use("/skills", require("./delete-routes/skillRoutes"));
router.use("/skill-progress", require("./delete-routes/skillProgressRoutes"));
router.use("/moods", require("./delete-routes/moodRoutes"));
router.use("/challenges", require("./delete-routes/challengeRoutes"));
router.use("/pomodoro", require("./delete-routes/pomodoroRoutes"));
router.use("/chatbot", require("./delete-routes/chatbotRoutes"));

module.exports = router;
