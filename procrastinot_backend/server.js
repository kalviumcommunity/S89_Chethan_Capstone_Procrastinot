const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const allRoutes = require("./routes/allRoutes.js");
const passport = require("passport");
const { generalLimiter } = require("./middleware/rateLimiter");
require("./config/passport");
const Task = require("./models/Task");

// Load environment variables
dotenv.config();

// 🔹 Ensure required environment variables exist
const requiredEnvVars = [
  "MONGO_URI", 
  "JWT_SECRET", 
  "PORT", 
  "GOOGLE_CLIENT_ID", 
  "GOOGLE_CLIENT_SECRET"
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

// Initialize Express app
const app = express();

// 🔹 Middleware
app.use(generalLimiter); // Apply rate limiting to all requests
app.use(cors({
  origin: function(origin, callback) {
    // Allow all origins for development
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' })); // Limit request body size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(passport.initialize());

// 🔹 Health-check route
app.get("/", (req, res) => res.status(200).json({ message: "🚀 Server is running!" }));

// 🔹 Favicon route to prevent 404 errors
app.get("/favicon.ico", (req, res) => res.status(204).end());

// 🔹 Mount all API feature routes
app.use("/api", allRoutes);

// ⏰ Email reminder scheduler (24h and 1h before due)
function startTaskEmailReminders() {
  let nodemailer;
  try { nodemailer = require('nodemailer'); } catch (e) {
    console.warn('Email reminders disabled: nodemailer not installed.');
    return;
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
    console.warn('Email reminders disabled: SMTP env vars missing.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const sentCache = new Set(); // in-memory de-duplication per process

  const sendReminder = async (user, task, label) => {
    const key = `${task._id}-${label}`;
    if (sentCache.has(key)) return;

    const due = new Date(task.dueDate);
    const subject = `Reminder: ${task.title} due ${due.toLocaleString()}`;
    const html = `
      <div style="font-family:Arial, sans-serif; color:#111;">
        <h2 style="margin:0 0 12px 0;">Task Reminder</h2>
        <p style="margin:0 0 8px 0;">Hi ${user.username || 'there'},</p>
        <p style="margin:0 0 8px 0;">This is a friendly reminder that your task:</p>
        <div style="padding:12px; border-left:3px solid #dc2626; background:#f9f9f9;">
          <div style="font-weight:700;">${task.title}</div>
          ${task.description ? `<div style="color:#444; margin-top:4px;">${task.description}</div>` : ''}
          <div style="margin-top:6px;"><strong>Due:</strong> ${due.toLocaleString()}</div>
          <div><strong>Priority:</strong> ${task.priority || 'Medium'}</div>
        </div>
        ${Array.isArray(task.importantLinks) && task.importantLinks.length ? `
          <div style="margin-top:12px;">
            <div style="font-weight:600; margin-bottom:6px;">Important Links</div>
            ${task.importantLinks.map(l => `<div><a href="${l}" target="_blank" rel="noopener">${l}</a></div>`).join('')}
          </div>` : ''}
        <p style="margin-top:16px; color:#555;">Stay sharp — you’ve got this. 🥷</p>
        <hr style="border:none; border-top:1px solid #eee; margin:16px 0;" />
        <div style="font-size:12px; color:#777;">You are receiving this because you have an upcoming task in Procrastinot.</div>
      </div>
    `;

    try {
      await transporter.sendMail({ from: EMAIL_FROM, to: user.email, subject, html });
      sentCache.add(key);
      if (sentCache.size > 5000) sentCache.clear();
      console.log(`📧 Reminder sent (${label}) for task ${task._id} to ${user.email}`);
    } catch (err) {
      console.error('Failed to send reminder:', err.message);
    }
  };

  const checkAndSend = async () => {
    try {
      const now = new Date();
      const w24Start = new Date(now.getTime() + (23 * 60 + 45) * 60000); // 23h45m
      const w24End = new Date(now.getTime() + (24 * 60 + 15) * 60000);   // 24h15m
      const w1Start = new Date(now.getTime() + 45 * 60000);              // 45m
      const w1End = new Date(now.getTime() + 75 * 60000);                // 1h15m

      const base = { dueDate: { $ne: null }, status: { $ne: 'Completed' } };

      const tasks24 = await Task.find({ ...base, dueDate: { $gte: w24Start, $lte: w24End } })
        .populate('userId', 'email username');
      for (const t of tasks24) {
        if (t.userId?.email) await sendReminder(t.userId, t, '24h');
      }

      const tasks1 = await Task.find({ ...base, dueDate: { $gte: w1Start, $lte: w1End } })
        .populate('userId', 'email username');
      for (const t of tasks1) {
        if (t.userId?.email) await sendReminder(t.userId, t, '1h');
      }
    } catch (err) {
      console.error('Reminder scheduler error:', err.message);
    }
  };

  setInterval(checkAndSend, 15 * 60 * 1000); // every 15 minutes
  setTimeout(checkAndSend, 5000); // initial kick after start
  console.log('⏰ Task email reminders scheduler started (every 15 minutes).');
}

// 🔹 404 Handler
app.use((req, res) => res.status(404).json({ error: "❌ Route not found" }));

// 🔹 Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// 🔹 Start the server **only after** DB connection
const PORT = process.env.PORT || 8080;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running at: http://localhost:${PORT}`);
      try { startTaskEmailReminders(); } catch (e) { console.warn('Failed to start reminders:', e.message); }
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1);
  });
