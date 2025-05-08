// models/MoodLog.js

const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  moodType: {
    type: String,
    enum: ['Happy', 'Sad', 'Anxious', 'Excited', 'Tired', 'Angry', 'Neutral'],
    required: true,
  },
  note: {
    type: String, // Optional user input for why they felt that way
    maxlength: 300,
  },
  loggedAt: {
    type: Date,
    default: Date.now,
  },
  sessionType: {
    type: String,
    enum: ['Before Pomodoro', 'After Pomodoro'],
    required: true,
  }
});

const MoodLog = mongoose.model('MoodLog', moodLogSchema);

module.exports = MoodLog;
