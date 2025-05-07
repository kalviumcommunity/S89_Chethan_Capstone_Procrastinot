// models/Task.js

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
    type: String, // stores list of AI-generated sub-tasks
  }],
  attachmentUrl: {
    type: String, // file uploads
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
