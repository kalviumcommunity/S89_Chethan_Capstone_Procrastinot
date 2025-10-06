//models/Task.js
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
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium',
  },
  isImportant: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
  },
  recurrence: {
    type: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
      default: 'none',
    },
    interval: {
      type: Number,
      default: 1,
    },
    endDate: {
      type: Date,
    },
  },
  category: {
    type: String,
    trim: true,
    default: 'General',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  estimatedTime: {
    type: Number, // in minutes
    default: 30,
  },
  actualTime: {
    type: Number, // in minutes
    default: 0,
  },
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
  importantLinks: [{
    type: String,
    trim: true,
  }],
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
  }],
  completedAt: {
    type: Date,
  },
  parentTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task', // For recurring tasks
  }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
