//User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    minlength: 6,
  },
  googleId: {
    type: String,
    required: function () {
      return !this.password;
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

// Pre-save hook for password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();

  // Check if the password is already hashed to prevent double hashing
  const isHashed = this.password.startsWith('$2a$') || this.password.startsWith('$2b$');
  if (!isHashed) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
