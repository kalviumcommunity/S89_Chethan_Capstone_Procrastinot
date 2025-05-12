//Challenge.js
const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  tags: [{
    type: String,
    trim: true, 
  }],
  reward: {
    type: String, 
  },
  startDate: {
    type: Date,
    default: Date.now, 
  },
  endDate: {
    type: Date, 
  },
  validFor: {
    type: Number, 
    default: 24,
  },
}, { timestamps: true }); 

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;
