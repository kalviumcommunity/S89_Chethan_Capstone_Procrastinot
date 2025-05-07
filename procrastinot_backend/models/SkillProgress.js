// models/SkillProgress.js

const mongoose = require('mongoose');

const skillProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  skill: {
    type: String, // e.g., "Coding", "Speaking"
    required: true,
  },
  subtopic: {
    type: String, // e.g., "HTML", "Python"
    required: true,
  },
  progress: {
    type: Number, // 0 to 100%
    default: 0,
    min: 0,
    max: 100,
  },
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
  streak: {
    type: Number, // Number of consecutive active days
    default: 0,
  }
});

const SkillProgress = mongoose.model('SkillProgress', skillProgressSchema);

module.exports = SkillProgress;
