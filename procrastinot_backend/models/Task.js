const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'In Progress', 'Revise Again'],
    default: 'Pending',
  },
  dueDate: {
    type: Date,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  moodBefore: {
    type: String,
    enum: ['Happy', 'Neutral', 'Sad', 'Stressed'],
  },
  moodAfter: {
    type: String,
    enum: ['Happy', 'Neutral', 'Sad', 'Stressed'],
  },
  pomodoroCount: {
    type: Number,
    default: 0,
  },
  aiBreakdown: [{
    type: String,
  }],
  attachmentUrl: {
    type: String, 
  },
  relatedSkills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  },
  pomodoroSessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PomodoroSession'
  }]
}, { timestamps: true }); 

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
