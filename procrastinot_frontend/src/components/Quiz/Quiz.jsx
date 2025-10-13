import { useState, useEffect } from 'react';
import DashboardNavbar from '../Dashboard/DashboardNavbar';
import UserProfile from '../Dashboard/UserProfile';
import quizService from '../../services/quizService';
import authService from '../../services/authService';
import styles from './Quiz.module.css';

const Quiz = () => {
  const [currentView, setCurrentView] = useState('topics');
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);

  const topics = [
    'JavaScript Fundamentals', 'React Basics', 'Node.js', 'Python Programming',
    'Data Structures', 'Web Development', 'Machine Learning', 'Cybersecurity',
    'Database Design', 'Cloud Computing', 'Mobile Development', 'DevOps'
  ];

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        console.log('Quiz - Checking authentication...');
        console.log('Quiz - Is authenticated:', authService.isAuthenticated());
        console.log('Quiz - Token exists:', !!localStorage.getItem('token'));
        console.log('Quiz - User ID exists:', !!localStorage.getItem('userId'));
        
        if (!authService.isAuthenticated()) {
          console.log('Quiz - Not authenticated, redirecting to home');
          window.location.href = '/';
          return;
        }
        
        console.log('Quiz - Fetching user profile...');
        const userData = await authService.getUserProfile();
        
        console.log('Quiz - User data received:', userData);
        setUser(userData);
        
        console.log('Quiz - Loading history...');
        await loadHistory();
        
        console.log('Quiz - Initialization complete');
      } catch (error) {
        console.error('Failed to initialize quiz:', error);
        if (error.message === 'Authentication failed' || error.message === 'Not authenticated') {
          console.log('Quiz - Authentication error, logging out');
          authService.logout();
          window.location.href = '/';
        } else {
          console.log('Quiz - Non-auth error, continuing without full initialization');
          // For non-auth errors, still show the page but with limited functionality
          setLoading(false);
        }
      } finally {
        setLoading(false);
      }
    };
    
    initializeQuiz();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await quizService.getQuizHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to load quiz history:', error);
      if (error.message === 'Authentication failed' || error.message === 'Not authenticated') {
        authService.logout();
        window.location.href = '/';
      }
      // Don't show error for history loading failure, just continue without history
    }
  };

  const startQuiz = async (topic) => {
    setQuizLoading(true);
    try {
      const quiz = await quizService.generateQuiz(topic);
      setCurrentQuiz(quiz);
      setAnswers(new Array(5).fill(-1));
      setCurrentQuestion(0);
      setCurrentView('quiz');
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      if (error.message === 'Authentication failed') {
        authService.logout();
        window.location.href = '/';
      } else {
        alert(`Failed to generate quiz: ${error.message}`);
      }
    } finally {
      setQuizLoading(false);
    }
  };

  const selectAnswer = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < 4) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setQuizLoading(true);
    try {
      const result = await quizService.submitQuiz(currentQuiz._id, answers);
      setResults(result);
      setCurrentView('results');
      loadHistory();
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      if (error.message === 'Authentication failed') {
        authService.logout();
        window.location.href = '/';
      } else {
        alert(`Failed to submit quiz: ${error.message}`);
      }
    } finally {
      setQuizLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentView('topics');
    setCurrentQuiz(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setResults(null);
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #dc2626 50%, #000000 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Loading your challenges...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // If user data is not loaded but we're authenticated, show a minimal interface
    if (authService.isAuthenticated()) {
      return (
        <div className={styles.container}>
          <DashboardNavbar user={{ username: 'Loading...', email: '' }} onLogout={handleLogout} />
          <div className={styles.content}>
            <div className={styles.header}>
              <h1>Daily Challenges</h1>
              <p>Loading your profile...</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  if (quizLoading) {
    return (
      <div className={styles.container}>
        <DashboardNavbar user={user} onLogout={handleLogout} />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <DashboardNavbar user={user} onLogout={handleLogout} />
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Daily Challenges</h1>
          <p>Challenge yourself with exciting quizzes on various topics!</p>
        </div>

        {currentView === 'topics' && (
          <div className={styles.topicsGrid}>
            {topics.map((topic, index) => (
              <div key={index} className={styles.topicCard} onClick={() => startQuiz(topic)}>
                <h3>{topic}</h3>
                <p>5 Questions • Multiple Choice</p>
                <button className={styles.startBtn}>Start Quiz</button>
              </div>
            ))}
          </div>
        )}

        {currentView === 'quiz' && currentQuiz && (
          <div className={styles.quizContainer}>
            <div className={styles.progress}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${((currentQuestion + 1) / 5) * 100}%` }}
                ></div>
              </div>
              <span>Question {currentQuestion + 1} of 5</span>
            </div>

            <div className={styles.question}>
              <h2>{currentQuiz.questions[currentQuestion].question}</h2>
              
              <div className={styles.options}>
                {currentQuiz.questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={`${styles.option} ${answers[currentQuestion] === index ? styles.selected : ''}`}
                    onClick={() => selectAnswer(index)}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </button>
                ))}
              </div>

              <button 
                className={styles.nextBtn}
                onClick={nextQuestion}
                disabled={answers[currentQuestion] === -1}
              >
                {currentQuestion === 4 ? 'Submit Quiz' : 'Next Question'}
              </button>
            </div>
          </div>
        )}

        {currentView === 'results' && results && (
          <div className={styles.results}>
            <div className={styles.scoreCard}>
              <h2>Quiz Complete!</h2>
              <div className={styles.score}>
                <span className={styles.scoreNumber}>{results.score}</span>
                <span className={styles.scoreTotal}>/ {results.total}</span>
              </div>
              <p className={styles.percentage}>
                {Math.round((results.score / results.total) * 100)}% Correct
              </p>
            </div>

            <div className={styles.reviewQuestions}>
              <h3>Review Answers</h3>
              {results.results.map((result, index) => (
                <div key={index} className={styles.reviewItem}>
                  <p className={styles.reviewQuestion}>{result.question}</p>
                  <div className={styles.reviewOptions}>
                    {result.options.map((option, optIndex) => (
                      <div 
                        key={optIndex}
                        className={`${styles.reviewOption} ${
                          optIndex === result.correctAnswer ? styles.correct :
                          optIndex === result.userAnswer && !result.correct ? styles.incorrect : ''
                        }`}
                      >
                        {String.fromCharCode(65 + optIndex)}. {option}
                        {optIndex === result.correctAnswer && <span className={styles.checkmark}>✓</span>}
                        {optIndex === result.userAnswer && !result.correct && <span className={styles.cross}>✗</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button className={styles.newQuizBtn} onClick={resetQuiz}>
              Take Another Quiz
            </button>
          </div>
        )}

        {currentView === 'topics' && history.length > 0 && (
          <div className={styles.history}>
            <h3>Recent Quizzes</h3>
            <div className={styles.historyList}>
              {history.slice(0, 5).map((quiz) => (
                <div key={quiz._id} className={styles.historyItem}>
                  <span className={styles.historyTopic}>{quiz.topic}</span>
                  <span className={styles.historyScore}>
                    {quiz.completed ? `${quiz.score}/5` : 'In Progress'}
                  </span>
                  <span className={styles.historyDate}>
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;