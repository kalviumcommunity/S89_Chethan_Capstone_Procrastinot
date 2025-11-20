import { GoogleGenerativeAI } from '@google/generative-ai';

// Simple and efficient AI service using modern Google GenAI
const API_KEY = 'AIzaSyDBqM3Ng0eRN_Tb_CWBAh8DTEUMpsB4Dss';

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    this.conversationHistory = [];
    this.isLoading = false;
  }

  async sendMessage(userMessage, context = {}) {
    if (this.isLoading) {
      throw new Error('Another request is in progress');
    }

    this.isLoading = true;

    try {
      // Build conversation context
      const prompt = this.buildPrompt(userMessage);
      
      // Generate response using modern API
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const botMessage = response.text();

      // Update conversation history
      this.conversationHistory.push(
        { role: 'user', content: userMessage },
        { role: 'assistant', content: botMessage }
      );

      // Keep history manageable
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      return {
        message: botMessage,
        success: true
      };

    } catch (error) {
      console.error('AI service error:', error);
      
      return {
        message: this.getFallbackResponse(userMessage),
        success: false,
        error: error.message
      };
    } finally {
      this.isLoading = false;
    }
  }

  buildPrompt(userMessage) {
    let prompt = `You are StudyMate AI, an intelligent assistant that provides helpful, accurate responses to any question. You are knowledgeable and always give direct, relevant answers.

Core principles:
• Answer the exact question asked - be precise and relevant
• Provide accurate information based on your knowledge
• Be conversational but focused on the user's specific query
• Give complete, helpful responses
• Use clear, easy-to-understand language

`;

    // Add recent conversation for context
    if (this.conversationHistory.length > 0) {
      prompt += 'Recent conversation:\n';
      this.conversationHistory.slice(-4).forEach((msg) => {
        prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      prompt += '\n';
    }

    prompt += `User: ${userMessage}\nAssistant:`;
    return prompt;
  }

  getFallbackResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('study') || message.includes('learn')) {
      return "I'm temporarily offline, but here's a study tip: The 'testing effect' shows that actively recalling information improves retention by up to 50%. Try explaining concepts aloud!";
    }
    
    if (message.includes('procrastination')) {
      return "Connection issue detected! Quick tip: Try the '2-minute rule' - if something takes less than 2 minutes, do it now. For bigger tasks, commit to just 5 minutes to overcome initial resistance.";
    }
    
    if (message.includes('focus') || message.includes('pomodoro')) {
      return "Service interruption! Focus insight: Your brain's attention naturally fluctuates in 90-120 minute cycles. Try aligning your work sessions with these natural rhythms.";
    }

    return "I'm temporarily unavailable, but I'll be back shortly to help with your questions! Whether it's productivity, learning strategies, or general knowledge - I'm here to assist.";
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  getHistory() {
    return this.conversationHistory;
  }
}

const geminiService = new GeminiService();
export default geminiService;