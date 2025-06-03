// server.js

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const allRoutes = require("./routes/allRoutes.js");

// Load environment variables from .env file
dotenv.config();

// Check for required env variables
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("❌ Missing required environment variables (MONGO_URI, JWT_SECRET)");
  process.exit(1);
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // during local dev
  credentials: true
}));
app.use(express.json());

// Health-check route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running 🟢" });
});

// Mount all API feature routes
app.use("/api", allRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found." });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Global Error Handler:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server only after DB connection
const PORT = process.env.PORT || 8080;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });