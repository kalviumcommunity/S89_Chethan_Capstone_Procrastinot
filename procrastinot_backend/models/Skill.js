const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true, 
  },
  subTopic: {
    type: String,
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },
  content: {
    type: String, 
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
  aiSuggestions: [{
    type: String, 
  }],
}, { timestamps: true }); 

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
