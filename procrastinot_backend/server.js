// server.js

const express=require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const allRoutes = require('./routes/allRoutes.js'); // ✅ Importing all routes

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());                      // Enable Cross-Origin requests
app.use(express.json());              // Parse incoming JSON requests

// Connect to MongoDB
connectDB();

// Health-check route
app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'Server is running 🟢' });
});

// ✅ Use all feature routes under /api
app.use('/api', allRoutes);

// Define Port
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
