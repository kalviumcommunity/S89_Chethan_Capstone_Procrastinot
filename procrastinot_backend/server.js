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

// 🔹 Ensure required environment variables exist (CLIENT_URL optional; CORS handles multiple origins)
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
// CORS: allow deployed frontend, localhost, and common preview domains
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'https://localhost:5173',
  'https://*.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow REST tools/no origin and any explicitly allowed origin
    if (!origin || allowedOrigins.some(o => {
      if (o.includes('*')) {
        const regex = new RegExp('^' + o.replace('.', '\\.').replace('*', '.*') + '$');
        return regex.test(origin);
      }
      return o === origin;
    })) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
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
