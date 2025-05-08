// server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());                      // Enable Cross-Origin requests
app.use(express.json());              // Parse incoming JSON requests

// Connect to MongoDB
connectDB();

// Basic health-check route
app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'Server is running 🟢' });
});

// Define Port
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
