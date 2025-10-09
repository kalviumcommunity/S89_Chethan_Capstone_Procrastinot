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
    const userId = req.user?._id;

    if (!message || !message.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    // Get user context for better AI responses
    const userContext = userId ? await getUserContext(userId) : {};
    const fullContext = { ...context, ...userContext, userId };

    // Generate AI response
    const aiResponse = await generateAIResponse(message, fullContext);

    // Save the conversation to database if user is authenticated
    if (userId) {
      try {
        const chatMessage = new ChatMessage({
          userId,
          message: message.trim(),
          response: aiResponse.message,
          context: fullContext,
          success: aiResponse.success,
          error: aiResponse.error || null
        });
        await chatMessage.save();
      } catch (saveError) {
        console.log('Could not save chat message:', saveError.message);
      }
    }

    res.status(200).json({
      success: true,
      message: aiResponse.message,
      timestamp: new Date(),
      context: fullContext
    });

  } catch (err) {
    console.error('Chatbot error:', err);
    
    // Return fallback response instead of error
    const fallbackResponse = generateFallbackResponse(req.body.message || '', {});
    res.status(200).json({
      success: true,
      message: fallbackResponse.message,
      timestamp: new Date()
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

// Enhanced AI response generator with dynamic context
async function generateAIResponse(message, context) {
  const GEMINI_API_KEY = 'AIzaSyAqhS3j8jOA4aHA5bYIYlJcbFNOrkb7T4Y';
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  // Get user's actual tasks for better context
  const userTasks = await Task.find({ userId: context.userId }).limit(5).sort({ createdAt: -1 });
  const recentSessions = await PomodoroSession.find({ userId: context.userId }).limit(3).sort({ createdAt: -1 });

  const ENHANCED_SYSTEM_CONTEXT = `You are StudyMate AI ⚡, an intelligent companion for the Procrastinot app. You're designed to be conversational, insightful, and genuinely helpful - like having a knowledgeable study buddy who understands productivity science.

Your core traits:
• Conversational and natural - respond like a thoughtful friend, not a robotic assistant
• Contextually aware - reference user's actual tasks, progress, and current situation
• Scientifically informed - base advice on research in psychology, neuroscience, and productivity
• Adaptable - match the user's communication style and energy level
• Encouraging yet realistic - provide hope while acknowledging real challenges

Your expertise spans:
• Cognitive psychology of procrastination and motivation
• Evidence-based study techniques (active recall, spaced repetition, interleaving)
• Time management systems (Pomodoro, time-blocking, GTD)
• Focus and attention training
• Habit formation and behavioral change
• Stress management and mental wellness
• Learning optimization and memory techniques
• Goal setting and achievement psychology

Response style:
• Use aesthetic symbols (• ⚡ ▪ ▸ ◆ ➡ ➢ ➣) instead of basic emojis
• Structure responses with clear sections when helpful
• Provide specific, actionable steps
• Reference user's actual tasks and progress when available
• Ask follow-up questions to better understand their situation
• Vary response length based on complexity - can be brief or detailed as needed
• Include relevant research insights when appropriate

═══ CURRENT SESSION CONTEXT ═══
▸ Location: ${getPageDescription(context.currentPage)}
▸ Active Tasks: ${userTasks.length} tasks in their list
${userTasks.length > 0 ? `▸ Recent Tasks: ${userTasks.map(t => `"${t.title}" (${t.status})`).join(', ')}` : ''}
▸ Focus Sessions: ${context.pomodoroSessions || 0} completed Pomodoro sessions
${recentSessions.length > 0 ? `▸ Recent Sessions: ${recentSessions.map(s => `${s.duration}min on ${s.taskTitle || 'focus work'}`).join(', ')}` : ''}
▸ Time Context: ${getTimeContext()} session

You can answer ANY question the user asks, not just productivity-related ones. However, always try to connect general topics back to learning, growth, or productivity when it makes sense. Be genuinely helpful and knowledgeable across all domains while maintaining your core identity as a study companion.`;

  try {
    const prompt = `${ENHANCED_SYSTEM_CONTEXT}\n\n═══ CURRENT QUERY ═══\n👤 User: ${message}\n\n⚡ StudyMate AI:`;

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
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1500,
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

// Helper functions for enhanced context
function getPageDescription(page) {
  const descriptions = {
    'dashboard': 'viewing their main dashboard with overview of tasks and progress',
    'smart_plan': 'using the Smart Plan feature to organize and plan tasks',
    'pomodoro': 'using the Pomodoro timer for focused work sessions',
    'home': 'browsing the main landing page'
  };
  return descriptions[page] || 'navigating the application';
}

function getTimeContext() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

// Enhanced fallback response generator
function generateFallbackResponse(message, context) {
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('hello') || messageLower.includes('hi')) {
    const timeGreeting = getTimeContext();
    return {
      success: true,
      message: `⚡ Good ${timeGreeting}! I'm StudyMate AI, your intelligent study companion. I can see you're ${getPageDescription(context.currentPage)}. How can I help you optimize your productivity today? ▪`
    };
  }
  
  if (messageLower.includes('procrastination') || messageLower.includes('procrastinate')) {
    return {
      success: true,
      message: "▪ Procrastination is fascinating from a psychological perspective! It's often our brain's way of avoiding tasks that feel threatening or overwhelming. Here's what research shows works:\n\n• Start with the '2-minute rule' - if it takes less than 2 minutes, do it now\n• Use 'temptation bundling' - pair boring tasks with something enjoyable\n• Try the 'next smallest step' approach - what's the tiniest action you can take?\n\nWhat specific task is your brain trying to avoid? ➡"
    };
  }
  
  if (messageLower.includes('pomodoro') || messageLower.includes('timer')) {
    return {
      success: true,
      message: `▸ The Pomodoro Technique leverages your brain's natural attention cycles! You've completed ${context.pomodoroSessions || 0} sessions - that's solid progress.\n\n• Research shows 25-minute intervals align with optimal focus spans\n• Breaks aren't just rest - they help consolidate learning\n• Try varying your break activities: movement, hydration, or brief meditation\n\nReady to start a focused session? What will you work on? ⚡`
    };
  }
  
  if (messageLower.includes('task') || messageLower.includes('todo')) {
    return {
      success: true,
      message: `▪ I can see you have ${context.userTasks || 'several'} tasks to work with! Task management is really about cognitive load management.\n\n• Use the 'Eisenhower Matrix' - urgent vs important\n• Try 'time-boxing' - assign specific time slots\n• Consider 'energy matching' - align task difficulty with your energy levels\n\nWhich tasks feel most overwhelming right now? ➢`
    };
  }
  
  if (messageLower.includes('study') || messageLower.includes('learn')) {
    return {
      success: true,
      message: "◆ Learning science has come so far! Here are evidence-based techniques that actually work:\n\n• Active recall beats passive reading by 50%\n• Spaced repetition leverages your forgetting curve\n• Interleaving different topics improves retention\n• The 'testing effect' - quiz yourself regularly\n\nWhat subject or skill are you working on? I can suggest specific strategies! ⚡"
    };
  }
  
  if (messageLower.includes('motivation') || messageLower.includes('energy')) {
    return {
      success: true,
      message: "▸ Here's what psychology tells us about motivation: it's not a feeling you wait for - it's a state you create!\n\n• Action creates motivation, not the other way around\n• Start with 'micro-commitments' - just 2 minutes\n• Use 'implementation intentions' - 'When X happens, I will do Y'\n• Celebrate small wins to build momentum\n\nWhat's one tiny step you could take right now? ➡"
    };
  }
  
  if (messageLower.includes('habit') || messageLower.includes('habits')) {
    return {
      success: true,
      message: "▪ Research on habit formation is fascinating! Here's what science tells us:\n\n• Habits form through the 'habit loop': cue → routine → reward\n• It takes 21-66 days to form a new habit (average is 66 days)\n• Start incredibly small - just 2 minutes daily\n• Stack new habits onto existing ones\n• Focus on identity change: 'I am someone who...'\n\nWhat habit are you trying to build? ⚡"
    };
  }
  
  if (messageLower.includes('photosynthesis')) {
    return {
      success: true,
      message: "▪ Photosynthesis is the process plants use to convert sunlight into energy! Here's the breakdown:\n\n• Plants absorb sunlight through chlorophyll (the green pigment)\n• They take in CO₂ from air and H₂O from roots\n• Using sunlight energy, they combine these to make glucose (sugar)\n• Oxygen is released as a byproduct\n• Formula: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\n\nThis process literally powers most life on Earth! Need help studying this? ⚡"
    };
  }
  
  if (messageLower.includes('work') || messageLower.includes('how can you')) {
    return {
      success: true,
      message: "▪ I'm StudyMate AI - here's how I can help:\n\n• Answer any question (academic, personal, or general knowledge)\n• Provide study strategies and learning techniques\n• Help with productivity and time management\n• Break down complex topics into understandable parts\n• Offer research-backed advice on habits and motivation\n• Assist with task planning and organization\n\nWhat would you like to explore? ⚡"
    };
  }
  
  // Default responses with variety
  const defaultResponses = [
    "▪ Great question! I can help with study strategies, productivity tips, or any topic you're curious about. What specifically interests you? ⚡",
    "▪ I'm here to help with anything - from academic subjects to productivity techniques. What would you like to explore? ⚡",
    "▪ That's interesting! I can provide insights on learning, productivity, or general knowledge. What's on your mind? ⚡"
  ];
  
  return {
    success: true,
    message: defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  };
}

module.exports = router;
