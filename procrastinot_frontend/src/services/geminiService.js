// Gemini AI Service for Procrastinot Chatbot
const GEMINI_API_KEY = 'AIzaSyAqhS3j8jOA4aHA5bYIYlJcbFNOrkb7T4Y';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const API_BASE_URL = 'https://s89-chethan-capstone-procrastinot-1.onrender.com/api';

// System context for the chatbot
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

Always provide practical, actionable advice. If users ask about general topics, try to relate them back to productivity, studying, or beating procrastination when appropriate. Keep responses concise but helpful, typically 2-4 sentences unless more detail is specifically requested.`;

class GeminiService {
  constructor() {
    this.conversationHistory = [];
    this.isLoading = false;
  }

  async sendMessage(userMessage, context = {}) {
    if (this.isLoading) {
      throw new Error('Another request is in progress');
    }

    this.isLoading = true;

    try {
      // First try to send to backend (which will use Gemini AI)
      const backendResponse = await this.sendToBackend(userMessage, context);
      if (backendResponse.success) {
        return backendResponse;
      }

      // If backend fails, try direct Gemini API
      return await this.sendToGemini(userMessage, context);

    } catch (error) {
      console.error('Chat service error:', error);
      
      // Return a helpful fallback message
      const fallbackMessage = this.getFallbackResponse(userMessage);
      
      return {
        message: fallbackMessage,
        success: false,
        error: error.message
      };
    } finally {
      this.isLoading = false;
    }
  }

  async sendToBackend(userMessage, context = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: userMessage,
          context: context
        })
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Add to conversation history
      this.conversationHistory.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });
      
      this.conversationHistory.push({
        role: 'model',
        parts: [{ text: data.message }]
      });

      // Keep conversation history manageable
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      return {
        message: data.message,
        success: true,
        context: data.context
      };

    } catch (error) {
      console.error('Backend chat error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendToGemini(userMessage, context = {}) {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      // Prepare the prompt with system context and conversation history
      const prompt = this.buildPrompt(userMessage, context);

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

      // Add bot response to history
      this.conversationHistory.push({
        role: 'model',
        parts: [{ text: botMessage }]
      });

      // Keep conversation history manageable (last 10 messages)
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      return {
        message: botMessage,
        success: true
      };

    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  buildPrompt(userMessage, context) {
    let prompt = SYSTEM_CONTEXT + '\n\n';

    // Add context about the app if available
    if (context.currentPage) {
      prompt += `Current page: ${context.currentPage}\n`;
    }
    
    if (context.userTasks && context.userTasks.length > 0) {
      prompt += `User has ${context.userTasks.length} tasks in their list.\n`;
    }

    if (context.pomodoroSessions && context.pomodoroSessions.length > 0) {
      prompt += `User has completed ${context.pomodoroSessions.length} Pomodoro sessions.\n`;
    }

    // Add recent conversation history for context
    if (this.conversationHistory.length > 0) {
      prompt += '\nRecent conversation:\n';
      this.conversationHistory.slice(-6).forEach(msg => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        prompt += `${role}: ${msg.parts[0].text}\n`;
      });
    }

    prompt += `\nUser: ${userMessage}\nAssistant:`;

    return prompt;
  }

  getFallbackResponse(userMessage) {
    const fallbackResponses = [
      "I'm having trouble connecting right now, but I'm here to help! Try asking me about study techniques, time management, or beating procrastination. 📚",
      "Sorry, I'm experiencing some technical difficulties. In the meantime, remember that breaking tasks into smaller chunks can help overcome procrastination! 🎯",
      "I'm temporarily unavailable, but here's a quick tip: The Pomodoro Technique (25 minutes focused work + 5 minute break) is great for maintaining focus! ⏰",
      "Having connection issues, but I'm still here to support your productivity journey! Try setting specific, achievable goals for today. 🚀"
    ];

    // Check if the message is about specific topics and provide relevant fallbacks
    const message = userMessage.toLowerCase();
    
    if (message.includes('study') || message.includes('learn')) {
      return "I'm having connection issues, but here's a study tip: Try the Feynman Technique - explain what you're learning in simple terms to test your understanding! 📖";
    }
    
    if (message.includes('procrastination') || message.includes('procrastinate')) {
      return "Connection problems, but remember: Procrastination often happens when tasks feel overwhelming. Break them down into smaller, manageable steps! 💪";
    }
    
    if (message.includes('pomodoro') || message.includes('timer')) {
      return "Having technical difficulties, but here's a Pomodoro tip: Start with shorter sessions (15-20 minutes) if 25 minutes feels too long initially! ⏱️";
    }

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  getHistory() {
    return this.conversationHistory;
  }

  // Get suggested prompts based on context
  async getSuggestedPrompts(context = {}) {
    try {
      // Try to get suggestions from backend first
      const response = await fetch(`${API_BASE_URL}/chatbot/suggestions/${localStorage.getItem('userId')}?currentPage=${context.currentPage || 'home'}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.suggestions || [];
      }
    } catch (error) {
      console.error('Error getting suggestions from backend:', error);
    }

    // Fallback to local suggestions
    return this.getLocalSuggestedPrompts(context);
  }

  getLocalSuggestedPrompts(context = {}) {
    const basePrompts = [
      "How can I stop procrastinating on difficult tasks?",
      "What's the best way to plan my study schedule?",
      "How do I stay focused during long study sessions?",
      "Can you help me break down a big project?",
      "What are some effective time management techniques?"
    ];

    const contextualPrompts = [];

    if (context.currentPage === 'pomodoro') {
      contextualPrompts.push(
        "How can I make my Pomodoro sessions more effective?",
        "What should I do during my break time?",
        "How many Pomodoro sessions should I do per day?"
      );
    }

    if (context.currentPage === 'smart_plan') {
      contextualPrompts.push(
        "How should I prioritize my tasks?",
        "What makes a good task description?",
        "How can I estimate how long tasks will take?"
      );
    }

    if (context.userTasks && context.userTasks.length > 5) {
      contextualPrompts.push(
        "I have too many tasks, how do I manage them?",
        "How can I avoid task overwhelm?"
      );
    }

    return [...contextualPrompts, ...basePrompts].slice(0, 5);
  }

  // Get chat history from backend
  async getChatHistory(limit = 50, page = 1) {
    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/history/${localStorage.getItem('userId')}?limit=${limit}&page=${page}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error getting chat history from backend:', error);
    }

    return { messages: [], pagination: {} };
  }

  // Get chat statistics from backend
  async getChatStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/stats/${localStorage.getItem('userId')}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error getting chat stats from backend:', error);
    }

    return {
      totalMessages: 0,
      successfulMessages: 0,
      successRate: 0,
      recentMessages: 0,
      contextStats: {}
    };
  }

  // Clear chat history from backend
  async clearChatHistory() {
    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/history/${localStorage.getItem('userId')}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        this.conversationHistory = [];
        return true;
      }
    } catch (error) {
      console.error('Error clearing chat history from backend:', error);
    }

    return false;
  }
}

// Create a singleton instance
const geminiService = new GeminiService();

export default geminiService;
