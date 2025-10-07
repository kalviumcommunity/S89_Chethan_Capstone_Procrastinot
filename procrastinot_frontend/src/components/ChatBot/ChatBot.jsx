import { useState, useEffect, useRef } from 'react';
import styles from './ChatBot.module.css';
import geminiService from '../../services/geminiService';
import authService from '../../services/authService';
import taskService from '../../services/taskService';
import pomodoroService from '../../services/pomodoroService';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState([]);
  const [userContext, setUserContext] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize chatbot with welcome message and context
  useEffect(() => {
    const initializeChatbot = async () => {
      try {
        // Get user context
        const context = await getUserContext();
        setUserContext(context);
        
        // Get suggested prompts
        const prompts = geminiService.getSuggestedPrompts(context);
        setSuggestedPrompts(prompts);

        // Add welcome message
        const welcomeMessage = {
          id: Date.now(),
          type: 'bot',
          content: "Hi! I'm ProcrastiBot, your AI study and productivity assistant! 🤖✨ I'm here to help you beat procrastination, improve your study habits, and stay productive. What would you like to work on today?",
          timestamp: new Date()
        };
        
        setMessages([welcomeMessage]);
      } catch (error) {
        console.error('Error initializing chatbot:', error);
      }
    };

    initializeChatbot();
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const getUserContext = async () => {
    const context = {
      currentPage: getCurrentPage(),
      userTasks: [],
      pomodoroSessions: []
    };

    try {
      if (authService.isAuthenticated()) {
        // Get user tasks
        const tasks = await taskService.getUserTasks();
        context.userTasks = tasks;

        // Get pomodoro sessions
        const sessions = await pomodoroService.getUserSessions();
        context.pomodoroSessions = sessions;
      }
    } catch (error) {
      console.error('Error getting user context:', error);
    }

    return context;
  };

  const getCurrentPage = () => {
    const path = window.location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path === '/smart-plan') return 'smart_plan';
    if (path === '/pomodoro') return 'pomodoro';
    return 'home';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await geminiService.sendMessage(message, userContext);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.message,
        timestamp: new Date(),
        success: response.success
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🔄",
        timestamp: new Date(),
        success: false
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedPrompt = (prompt) => {
    handleSendMessage(prompt);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const clearChat = () => {
    geminiService.clearHistory();
    setMessages([]);
    
    // Re-initialize with welcome message
    const welcomeMessage = {
      id: Date.now(),
      type: 'bot',
      content: "Chat cleared! How can I help you with your productivity and study goals today? 🚀",
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        className={`${styles.chatButton} ${isOpen ? styles.chatButtonOpen : ''}`}
        onClick={toggleChat}
        title="Open ProcrastiBot"
      >
        <div className={styles.chatButtonIcon}>
          {isOpen ? '✕' : '🤖'}
        </div>
        {!isOpen && (
          <div className={styles.chatButtonPulse}></div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderInfo}>
              <div className={styles.chatHeaderIcon}>🤖</div>
              <div>
                <h3 className={styles.chatHeaderTitle}>ProcrastiBot</h3>
                <p className={styles.chatHeaderSubtitle}>Your AI Study Assistant</p>
              </div>
            </div>
            <div className={styles.chatHeaderActions}>
              <button 
                className={styles.chatHeaderBtn}
                onClick={clearChat}
                title="Clear Chat"
              >
                🗑️
              </button>
              <button 
                className={styles.chatHeaderBtn}
                onClick={toggleChat}
                title="Close Chat"
              >
                ✕
              </button>
            </div>
          </div>

          <div className={styles.chatMessages}>
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`${styles.message} ${styles[message.type]}`}
              >
                <div className={styles.messageContent}>
                  {message.content}
                </div>
                <div className={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className={`${styles.message} ${styles.bot}`}>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          {messages.length === 1 && suggestedPrompts.length > 0 && (
            <div className={styles.suggestedPrompts}>
              <p className={styles.suggestedPromptsTitle}>Try asking:</p>
              <div className={styles.suggestedPromptsList}>
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    className={styles.suggestedPrompt}
                    onClick={() => handleSuggestedPrompt(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.chatInput}>
            <div className={styles.chatInputContainer}>
              <textarea
                ref={inputRef}
                className={styles.chatInputField}
                placeholder="Ask me about productivity, studying, or beating procrastination..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                rows="1"
                disabled={isLoading}
              />
              <button
                className={`${styles.chatSendButton} ${inputMessage.trim() ? styles.chatSendButtonActive : ''}`}
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
              >
                {isLoading ? (
                  <div className={styles.sendButtonSpinner}></div>
                ) : (
                  '➤'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
