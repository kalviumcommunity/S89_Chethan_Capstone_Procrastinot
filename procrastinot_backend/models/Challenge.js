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
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'Failed'],
      default: 'In Progress'
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date
    }
  }],
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }]
}, { timestamps: true }); 

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;
