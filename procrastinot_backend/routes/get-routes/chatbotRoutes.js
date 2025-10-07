//routes/get-routes/chatbotRoutes.js
const express = require("express");
const router = express.Router();
const ChatMessage = require("../../models/ChatMessage");

// ✅ Get chat history for a user
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, page = 1 } = req.query;
    
    // Verify user can only access their own chat history
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ error: "Forbidden: You can only access your own chat history." });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const messages = await ChatMessage.find({ userId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('message response context timestamp success');

    const totalMessages = await ChatMessage.countDocuments({ userId });

    res.status(200).json({
      messages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalMessages / parseInt(limit)),
        totalMessages,
        hasNext: skip + messages.length < totalMessages,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chat history." });
  }
});

// ✅ Get chat statistics for a user
router.get("/stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user can only access their own stats
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ error: "Forbidden: You can only access your own chat statistics." });
    }

    const [
      totalMessages,
      successfulMessages,
      recentMessages,
      contextStats
    ] = await Promise.all([
      ChatMessage.countDocuments({ userId }),
      ChatMessage.countDocuments({ userId, success: true }),
      ChatMessage.countDocuments({ 
        userId, 
        timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
      }),
      ChatMessage.aggregate([
        { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
        {
          $group: {
            _id: "$context.currentPage",
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    res.status(200).json({
      totalMessages,
      successfulMessages,
      successRate: totalMessages > 0 ? (successfulMessages / totalMessages * 100).toFixed(2) : 0,
      recentMessages,
      contextStats: contextStats.reduce((acc, stat) => {
        acc[stat._id || 'unknown'] = stat.count;
        return acc;
      }, {})
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chat statistics." });
  }
});

// ✅ Get suggested prompts based on user context
router.get("/suggestions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPage = 'home' } = req.query;
    
    // Verify user can only access their own suggestions
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ error: "Forbidden: You can only access your own suggestions." });
    }

    // Get user context
    const Task = require("../../models/Task");
    const PomodoroSession = require("../../models/PomodoroSession");
    
    const [taskCount, sessionCount] = await Promise.all([
      Task.countDocuments({ userId }),
      PomodoroSession.countDocuments({ userId, status: 'Completed' })
    ]);

    const suggestions = generateSuggestions(currentPage, { taskCount, sessionCount });

    res.status(200).json({ suggestions });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch suggestions." });
  }
});

// Helper function to generate contextual suggestions
function generateSuggestions(currentPage, context) {
  const baseSuggestions = [
    "How can I stop procrastinating on difficult tasks?",
    "What's the best way to plan my study schedule?",
    "How do I stay focused during long study sessions?",
    "Can you help me break down a big project?",
    "What are some effective time management techniques?"
  ];

  const contextualSuggestions = [];

  switch (currentPage) {
    case 'pomodoro':
      contextualSuggestions.push(
        "How can I make my Pomodoro sessions more effective?",
        "What should I do during my break time?",
        "How many Pomodoro sessions should I do per day?"
      );
      break;
    case 'smart_plan':
      contextualSuggestions.push(
        "How should I prioritize my tasks?",
        "What makes a good task description?",
        "How can I estimate how long tasks will take?"
      );
      break;
    case 'dashboard':
      contextualSuggestions.push(
        "How can I set better goals?",
        "What are some productivity metrics I should track?",
        "How do I maintain consistency in my habits?"
      );
      break;
  }

  // Add context-specific suggestions
  if (context.taskCount > 10) {
    contextualSuggestions.push(
      "I have too many tasks, how do I manage them?",
      "How can I avoid task overwhelm?"
    );
  }

  if (context.sessionCount > 0) {
    contextualSuggestions.push(
      `I've completed ${context.sessionCount} Pomodoro sessions, how can I improve?`
    );
  }

  return [...contextualSuggestions, ...baseSuggestions].slice(0, 5);
}

module.exports = router;
