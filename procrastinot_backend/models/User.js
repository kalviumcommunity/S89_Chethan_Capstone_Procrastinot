//models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username must be less than 30 characters'],
    match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    minlength: [6, 'Password must be at least 6 characters long'],
    maxlength: [128, 'Password must be less than 128 characters'],
    validate: {
      validator: function(password) {
        // Skip validation if password is already hashed or if it's a Google user
        if (!password || this.googleId || password.startsWith('$2a$') || password.startsWith('$2b$')) {
          return true;
        }
        // Check for at least one letter and one number
        return /[a-zA-Z]/.test(password) && /\d/.test(password);
      },
      message: 'Password must contain at least one letter and one number'
    }
  },
  googleId: {
    type: String,
    sparse: true, // Allows multiple null values but unique non-null values
    validate: {
      validator: function(googleId) {
        // Either password or googleId must be present
        return this.password || googleId;
      },
      message: 'Either password or Google ID must be provided'
    }
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  skillProgress: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillProgress'
  }],
  pomodoroSessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PomodoroSession'
  }],
  moodLogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MoodLog'
  }],
  completedChallenges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

// Pre-save hook for password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();

  const isHashed = this.password.startsWith('$2a$') || this.password.startsWith('$2b$');
  if (!isHashed) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
