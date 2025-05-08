// models/Skill.js

const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true, // e.g., "Coding", "Speaking"
  },
  subTopic: {
    type: String,
    required: true, // e.g., "HTML", "Python"
  },
  content: {
    type: String, // Markdown or plain text for in-app learning
  },
  progress: {
    type: Number,
    default: 0, // percentage completion
    min: 0,
    max: 100,
  },
  streak: {
    type: Number,
    default: 0, // number of consecutive days learning this skill
  },
  lastStudiedAt: {
    type: Date,
  },
  aiSuggestions: [{
    type: String, // e.g., "Next: Learn CSS Grid"
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
