const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const allRoutes = require("./routes/allRoutes.js");
const passport = require("passport");
const { generalLimiter } = require("./middleware/rateLimiter");
require("./config/passport");

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

// 🔹 Mount all API feature routes
app.use("/api", allRoutes);

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
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1);
  });
