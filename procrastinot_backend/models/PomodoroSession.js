//models/PomodoroSession.js
const mongoose = require('mongoose');

const pomodoroSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  endTime: {
    type: Date,
  },
  duration: {
    type: Number, 
    required: true,
  },
  status: {
    type: String,
    enum: ['Completed', 'In Progress', 'Paused'],
    default: 'In Progress',
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null, 
  },
  moodBefore: {
    type: String,
    enum: ['Happy', 'Neutral', 'Sad', 'Anxious', 'Excited'],
    default: 'Neutral',
  },
  moodAfter: {
    type: String,
    enum: ['Happy', 'Neutral', 'Sad', 'Anxious', 'Excited'],
    default: 'Neutral',
  },
  notes: {
    type: String,
    trim: true,
  },
}, { timestamps: true }); 

const PomodoroSession = mongoose.model('PomodoroSession', pomodoroSessionSchema);

module.exports = PomodoroSession;
