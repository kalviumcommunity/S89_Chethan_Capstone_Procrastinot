//SkillProgress.js
const mongoose = require('mongoose');

const skillProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true,
  },
  subtopic: {
    type: String, 
    required: true,
    trim: true,
  },
  progress: {
    type: Number, 
    default: 0,
    min: 0,
    max: 100,
  },
  streak: {
    type: Number, 
    default: 0,
  },
  lastStudiedAt: {
    type: Date, 
  },
}, { timestamps: true }); 

const SkillProgress = mongoose.model('SkillProgress', skillProgressSchema);

module.exports = SkillProgress;
