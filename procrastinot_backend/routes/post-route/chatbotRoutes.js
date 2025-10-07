//routes/post-route/chatbotRoutes.js
const express = require('express');
const ChatMessage = require('../../models/ChatMessage');
const Task = require('../../models/Task');
const PomodoroSession = require('../../models/PomodoroSession');
const router = express.Router();

// POST: Send message to chatbot and get AI response
router.post('/chat', async (req, res) => {
  try {
    const { message, context = {} } = req.body;
    const userId = req.user._id;

    if (!message || !message.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    // Get user context for better AI responses
    const userContext = await getUserContext(userId);
    const fullContext = { ...context, ...userContext };

    // Here you would integrate with your AI service (Gemini, OpenAI, etc.)
    // For now, we'll create a mock response
    const aiResponse = await generateAIResponse(message, fullContext);

    // Save the conversation to database
    const chatMessage = new ChatMessage({
      userId,
      message: message.trim(),
      response: aiResponse.message,
      context: fullContext,
      success: aiResponse.success,
      error: aiResponse.error || null
    });

    await chatMessage.save();

    res.status(200).json({
      success: true,
      message: aiResponse.message,
      timestamp: new Date(),
      context: fullContext
    });

  } catch (err) {
    console.error('Chatbot error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process chat message' 
    });
  }
});

// Helper function to get user context
async function getUserContext(userId) {
  try {
    const [taskCount, sessionCount] = await Promise.all([
      Task.countDocuments({ userId }),
      PomodoroSession.countDocuments({ userId, status: 'Completed' })
    ]);

    return {
      userTasks: taskCount,
      pomodoroSessions: sessionCount
    };
  } catch (error) {
    console.error('Error getting user context:', error);
    return {
      userTasks: 0,
      pomodoroSessions: 0
    };
  }
}

// Gemini AI response generator
async function generateAIResponse(message, context) {
  const GEMINI_API_KEY = 'AIzaSyAqhS3j8jOA4aHA5bYIYlJcbFNOrkb7T4Y';
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  const SYSTEM_CONTEXT = `You are ProcrastiBot, an AI assistant for the Procrastinot app - a productivity and study-focused application designed to help users beat procrastination and improve their study habits.

Your personality:
- Friendly, encouraging, and supportive
- Knowledgeable about productivity techniques, study methods, and time management
- Focused on helping users overcome procrastination
- Professional but approachable tone
- Use emojis sparingly but effectively

Your expertise includes:
- Pomodoro Technique and time management
- Study strategies and learning techniques
- Procrastination psychology and solutions
- Task planning and organization
- Focus and concentration methods
- Habit formation and breaking bad habits
- Stress management and work-life balance
- Goal setting and achievement

App features you can help with:
- Pomodoro timer usage and optimization
- Task management and prioritization
- Study planning and scheduling
- Productivity tips and techniques
- Motivation and accountability
- Habit tracking and improvement

User context:
- Current page: ${context.currentPage || 'home'}
- User has ${context.userTasks || 0} tasks
- User has completed ${context.pomodoroSessions || 0} Pomodoro sessions

Always provide practical, actionable advice. If users ask about general topics, try to relate them back to productivity, studying, or beating procrastination when appropriate. Keep responses concise but helpful, typically 2-4 sentences unless more detail is specifically requested.`;

  try {
    const prompt = `${SYSTEM_CONTEXT}\n\nUser: ${message}\nAssistant:`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const botMessage = data.candidates[0].content.parts[0].text;

    return {
      success: true,
      message: botMessage
    };

  } catch (error) {
    console.error('Gemini AI Error:', error);
    
    // Fallback to rule-based responses
    return generateFallbackResponse(message, context);
  }
}

// Fallback response generator
function generateFallbackResponse(message, context) {
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('hello') || messageLower.includes('hi')) {
    return {
      success: true,
      message: "Hello! I'm ProcrastiBot, your AI study assistant! 🤖✨ I'm here to help you beat procrastination and improve your productivity. What would you like to work on today?"
    };
  }
  
  if (messageLower.includes('procrastination') || messageLower.includes('procrastinate')) {
    return {
      success: true,
      message: "Procrastination is a common challenge! Here are some strategies that work: 1) Break tasks into smaller chunks, 2) Use the Pomodoro Technique (25 min work + 5 min break), 3) Start with the easiest part first, 4) Remove distractions. What specific task are you struggling with? 🎯"
    };
  }
  
  if (messageLower.includes('pomodoro') || messageLower.includes('timer')) {
    return {
      success: true,
      message: `Great choice! The Pomodoro Technique is excellent for focus. You've completed ${context.pomodoroSessions} sessions so far! 💪 Here's how to make the most of it: 1) Choose a specific task, 2) Set timer for 25 minutes, 3) Work with full focus, 4) Take a 5-minute break. Ready to start a session? ⏰`
    };
  }
  
  if (messageLower.includes('task') || messageLower.includes('todo')) {
    return {
      success: true,
      message: `You have ${context.userTasks} tasks in your list! 📋 Here are some task management tips: 1) Prioritize by importance and urgency, 2) Break large tasks into smaller steps, 3) Set specific deadlines, 4) Focus on one task at a time. Would you like help organizing your current tasks?`
    };
  }
  
  if (messageLower.includes('study') || messageLower.includes('learn')) {
    return {
      success: true,
      message: "Excellent! Here are proven study techniques: 1) Active recall - test yourself regularly, 2) Spaced repetition - review at increasing intervals, 3) Feynman Technique - explain concepts simply, 4) Pomodoro for focused study sessions. What subject are you studying? 📚"
    };
  }
  
  if (messageLower.includes('motivation') || messageLower.includes('motivated')) {
    return {
      success: true,
      message: "Motivation comes and goes, but discipline is what gets things done! 💪 Remember: 1) Start small - even 5 minutes counts, 2) Focus on progress, not perfection, 3) Celebrate small wins, 4) Remember your 'why'. What's your main goal right now? 🎯"
    };
  }
  
  // Default response
  return {
    success: true,
    message: "That's a great question! As your productivity assistant, I'm here to help with study techniques, time management, beating procrastination, and staying focused. Could you tell me more about what specific challenge you're facing? I'm here to support your success! 🚀"
  };
}

module.exports = router;
