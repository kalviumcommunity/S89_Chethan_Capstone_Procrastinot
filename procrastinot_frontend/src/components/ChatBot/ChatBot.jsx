import { useState, useEffect, useRef } from 'react';
import styles from './ChatBot.module.css';
import geminiService from '../../services/geminiService';
import chatbotService from '../../services/chatbotService';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState([]);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Format message content for better readability
  const formatMessage = (content) => {
    return content
      .split('\n')
      .map((line, index) => (
        <div key={index} className={styles.messageLine}>
          {line}
        </div>
      ));
  };

  // Wait for page to fully load before showing chatbot
  useEffect(() => {
    const handlePageLoad = () => {
      setTimeout(() => setIsPageLoaded(true), 1000); // 1 second delay after page load
    };

    if (document.readyState === 'complete') {
      handlePageLoad();
    } else {
      window.addEventListener('load', handlePageLoad);
      return () => window.removeEventListener('load', handlePageLoad);
    }
  }, []);

  // Initialize chatbot when page is loaded
  useEffect(() => {
    if (!isPageLoaded) return;

    const initializeChatbot = () => {
      // Get contextual suggestions
      const prompts = chatbotService.getContextualSuggestions();
      setSuggestedPrompts(prompts);

      // Set welcome message
      const welcomeMessage = {
        id: Date.now(),
        type: 'bot',
        content: chatbotService.getPersonalizedWelcome(),
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
    };

    initializeChatbot();
  }, [isPageLoaded]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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
      const response = await geminiService.sendMessage(message);
      
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
        content: "I'm temporarily unavailable, but I'll be back shortly to help with your questions!",
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
      content: chatbotService.getPersonalizedWelcome(),
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  };

  // Don't render until page is loaded
  if (!isPageLoaded) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        className={`${styles.chatButton} ${isOpen ? styles.chatButtonOpen : ''}`}
        onClick={toggleChat}
        title="Open StudyMate AI"
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
                <h3 className={styles.chatHeaderTitle}>StudyMate AI</h3>
                <p className={styles.chatHeaderSubtitle}>Your Intelligent Study Companion</p>
              </div>
            </div>
            <div className={styles.chatHeaderActions}>
              <button 
                className={styles.chatHeaderBtn}
                onClick={clearChat}
                title="Clear Chat"
              >
                ⟳
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
                  {formatMessage(message.content)}
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
              <p className={styles.suggestedPromptsTitle}>💡 Try asking:</p>
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
                placeholder="Ask me anything - productivity tips, study strategies, or general questions..."
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