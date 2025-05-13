// server.js

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const allRoutes = require("./routes/allRoutes.js"); // ✅ Importing all routes

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin requests
app.use(express.json()); // Parse incoming JSON requests

// Connect to MongoDB
connectDB();

// Health-check route
app.get("/api/ping", (req, res) => {
  res.status(200).json({ message: "Server is running 🟢" });
});

// ✅ Mount all API feature routes
app.use("/api", allRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Global Error Handler:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Define Port
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
