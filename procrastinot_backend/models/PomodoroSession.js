import mongoose from "mongoose";

const PomodoroSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // duration in minutes
    required: true,
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    default: null, // not always linked to a specific task
  },
  moodBefore: {
    type: String,
    enum: ["Happy", "Neutral", "Sad", "Anxious", "Excited"],
    default: "Neutral",
  },
  moodAfter: {
    type: String,
    enum: ["Happy", "Neutral", "Sad", "Anxious", "Excited"],
    default: "Neutral",
  },
  notes: {
    type: String,
    trim: true,
  }
}, {
  timestamps: true
});

export default mongoose.model("PomodoroSession", PomodoroSessionSchema);
