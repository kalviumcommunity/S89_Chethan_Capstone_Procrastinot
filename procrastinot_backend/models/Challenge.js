// models/Challenge.js

const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    maxlength: 300,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  tags: [String], // e.g., ["focus", "health", "mindfulness"]
  createdAt: {
    type: Date,
    default: Date.now,
  },
  validFor: {
    type: Number, // Duration in hours the challenge remains valid
    default: 24,
  }
});

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;
