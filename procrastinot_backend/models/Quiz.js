const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true }
  }],
  userAnswers: [{ type: Number }],
  score: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', QuizSchema);