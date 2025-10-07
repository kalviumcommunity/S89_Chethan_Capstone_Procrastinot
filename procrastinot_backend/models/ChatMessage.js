//models/ChatMessage.js
const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  response: {
    type: String,
    required: true,
    trim: true,
  },
  context: {
    currentPage: {
      type: String,
      enum: ['home', 'dashboard', 'smart_plan', 'pomodoro'],
      default: 'home'
    },
    userTasks: {
      type: Number,
      default: 0
    },
    pomodoroSessions: {
      type: Number,
      default: 0
    }
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  success: {
    type: Boolean,
    default: true,
  },
  error: {
    type: String,
    default: null,
  }
}, { timestamps: true });

// Index for efficient querying
chatMessageSchema.index({ userId: 1, timestamp: -1 });
chatMessageSchema.index({ userId: 1, createdAt: -1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
