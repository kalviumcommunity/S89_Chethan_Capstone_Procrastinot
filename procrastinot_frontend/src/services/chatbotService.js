// Simplified Chatbot Service
class ChatbotService {
  constructor() {
    this.currentPage = 'home';
  }

  // Get current page context
  getCurrentPage() {
    const path = window.location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path === '/smart-plan') return 'smart_plan';
    if (path === '/pomodoro') return 'pomodoro';
    return 'home';
  }

  // Get contextual suggestions based on current page
  getContextualSuggestions() {
    const currentPage = this.getCurrentPage();
    const { timeOfDay } = this.getTimeContext();
    
    const suggestions = [];

    // Page-based suggestions
    if (currentPage === 'pomodoro') {
      suggestions.push(
        "What's the science behind the Pomodoro Technique?",
        "How can I optimize my focus sessions?",
        "What should I do during my breaks?"
      );
    } else if (currentPage === 'smart_plan') {
      suggestions.push(
        "How do I prioritize when everything feels urgent?",
        "What's the best way to estimate task duration?",
        "How can I make my planning more realistic?"
      );
    } else if (currentPage === 'dashboard') {
      suggestions.push(
        "How can I track my productivity effectively?",
        "What metrics actually matter for progress?",
        "How do I celebrate small wins?"
      );
    }

    // Time-based suggestions
    if (timeOfDay === 'morning') {
      suggestions.push("What's the best way to start my productive day?");
    } else if (timeOfDay === 'afternoon') {
      suggestions.push("I'm feeling less focused this afternoon - any tips?");
    } else if (timeOfDay === 'evening') {
      suggestions.push("How should I plan for tomorrow's productivity?");
    }

    // General helpful suggestions
    suggestions.push(
      "What does research say about building better habits?",
      "How can I maintain motivation long-term?",
      "What's the psychology behind procrastination?"
    );

    return suggestions.slice(0, 5);
  }

  // Get time-based context
  getTimeContext() {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    const isWeekend = day === 0 || day === 6;
    
    let timeOfDay = 'morning';
    if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17) timeOfDay = 'evening';
    
    return {
      timeOfDay,
      hour,
      isWeekend,
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day]
    };
  }

  // Get personalized welcome message
  getPersonalizedWelcome() {
    const { timeOfDay, isWeekend } = this.getTimeContext();
    const currentPage = this.getCurrentPage();

    let welcome = `⚡ Good ${timeOfDay}! I'm StudyMate AI, your intelligent study companion.`;

    if (currentPage === 'pomodoro') {
      welcome += ` Ready to boost your focus with some productive sessions?`;
    } else if (currentPage === 'smart_plan') {
      welcome += ` Let's organize your tasks and create an effective plan!`;
    } else if (currentPage === 'dashboard') {
      welcome += ` Let's review your progress and optimize your productivity!`;
    }

    if (isWeekend) {
      welcome += ` Perfect time for some focused learning or planning ahead.`;
    }

    welcome += ` What would you like to explore? ▪`;
    return welcome;
  }

  // Get basic user context
  async getUserContext() {
    return {
      currentPage: this.getCurrentPage(),
      timeContext: this.getTimeContext(),
      currentTime: new Date().toISOString()
    };
  }
}

const chatbotService = new ChatbotService();
export default chatbotService;