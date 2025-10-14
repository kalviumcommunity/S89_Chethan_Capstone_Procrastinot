import { useState, useEffect } from 'react';
import DashboardNavbar from '../Dashboard/DashboardNavbar';
import authService from '../../services/authService';
import eduSpaceService from '../../services/eduSpaceService';
import styles from './EduSpace.module.css';

const EduSpace = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('cards');
  const [selectedTech, setSelectedTech] = useState(null);
  const [content, setContent] = useState('');
  const [contentLoading, setContentLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const techCards = [
    { id: 'python', name: 'Python', icon: '🐍', category: 'Programming' },
    { id: 'javascript', name: 'JavaScript', icon: '🟨', category: 'Programming' },
    { id: 'java', name: 'Java', icon: '☕', category: 'Programming' },
    { id: 'cpp', name: 'C++', icon: '⚙️', category: 'Programming' },
    { id: 'csharp', name: 'C#', icon: '🔷', category: 'Programming' },
    { id: 'go', name: 'Go', icon: '🔵', category: 'Programming' },
    { id: 'rust', name: 'Rust', icon: '🦀', category: 'Programming' },
    { id: 'typescript', name: 'TypeScript', icon: '🔷', category: 'Programming' },
    { id: 'react', name: 'React', icon: '⚛️', category: 'Frontend' },
    { id: 'vue', name: 'Vue.js', icon: '💚', category: 'Frontend' },
    { id: 'angular', name: 'Angular', icon: '🔺', category: 'Frontend' },
    { id: 'nextjs', name: 'Next.js', icon: '⚫', category: 'Frontend' },
    { id: 'nodejs', name: 'Node.js', icon: '🟢', category: 'Backend' },
    { id: 'express', name: 'Express.js', icon: '🚀', category: 'Backend' },
    { id: 'django', name: 'Django', icon: '🎸', category: 'Backend' },
    { id: 'flask', name: 'Flask', icon: '🌶️', category: 'Backend' },
    { id: 'mongodb', name: 'MongoDB', icon: '🍃', category: 'Database' },
    { id: 'postgresql', name: 'PostgreSQL', icon: '🐘', category: 'Database' },
    { id: 'mysql', name: 'MySQL', icon: '🐬', category: 'Database' },
    { id: 'redis', name: 'Redis', icon: '🔴', category: 'Database' },
    { id: 'docker', name: 'Docker', icon: '🐳', category: 'DevOps' },
    { id: 'kubernetes', name: 'Kubernetes', icon: '☸️', category: 'DevOps' },
    { id: 'jenkins', name: 'Jenkins', icon: '👨‍🔧', category: 'DevOps' },
    { id: 'terraform', name: 'Terraform', icon: '🏗️', category: 'DevOps' },
    { id: 'aws', name: 'AWS', icon: '☁️', category: 'Cloud' },
    { id: 'azure', name: 'Azure', icon: '🔵', category: 'Cloud' },
    { id: 'gcp', name: 'Google Cloud', icon: '🌈', category: 'Cloud' },
    { id: 'firebase', name: 'Firebase', icon: '🔥', category: 'Cloud' },
    { id: 'machinelearning', name: 'Machine Learning', icon: '🤖', category: 'AI/ML' },
    { id: 'tensorflow', name: 'TensorFlow', icon: '🧠', category: 'AI/ML' },
    { id: 'pytorch', name: 'PyTorch', icon: '🔥', category: 'AI/ML' },
    { id: 'opencv', name: 'OpenCV', icon: '👁️', category: 'AI/ML' },
    { id: 'blockchain', name: 'Blockchain', icon: '⛓️', category: 'Web3' },
    { id: 'ethereum', name: 'Ethereum', icon: '💎', category: 'Web3' },
    { id: 'solidity', name: 'Solidity', icon: '📜', category: 'Web3' },
    { id: 'cybersecurity', name: 'Cybersecurity', icon: '🛡️', category: 'Security' },
    { id: 'penetration', name: 'Penetration Testing', icon: '🔍', category: 'Security' },
    { id: 'git', name: 'Git & GitHub', icon: '🐙', category: 'Tools' },
    { id: 'linux', name: 'Linux', icon: '🐧', category: 'Systems' },
    { id: 'graphql', name: 'GraphQL', icon: '🔗', category: 'API' },
    { id: 'swift', name: 'Swift', icon: '🦉', category: 'Mobile' },
    { id: 'kotlin', name: 'Kotlin', icon: '🎯', category: 'Mobile' },
    { id: 'flutter', name: 'Flutter', icon: '🦋', category: 'Mobile' },
    { id: 'reactnative', name: 'React Native', icon: '📱', category: 'Mobile' },
    { id: 'unity', name: 'Unity', icon: '🎮', category: 'GameDev' },
    { id: 'unreal', name: 'Unreal Engine', icon: '🎯', category: 'GameDev' },
    { id: 'blender', name: 'Blender', icon: '🎨', category: '3D/Animation' },
    { id: 'photoshop', name: 'Photoshop', icon: '🖼️', category: 'Design' },
    { id: 'figma', name: 'Figma', icon: '🎨', category: 'Design' },
    { id: 'sketch', name: 'Sketch', icon: '✏️', category: 'Design' },
    { id: 'sass', name: 'Sass/SCSS', icon: '💅', category: 'Frontend' },
    { id: 'tailwind', name: 'Tailwind CSS', icon: '🌊', category: 'Frontend' },
    { id: 'bootstrap', name: 'Bootstrap', icon: '🅱️', category: 'Frontend' },
    { id: 'webpack', name: 'Webpack', icon: '📦', category: 'Tools' },
    { id: 'vite', name: 'Vite', icon: '⚡', category: 'Tools' },
    { id: 'eslint', name: 'ESLint', icon: '🔍', category: 'Tools' },
    { id: 'jest', name: 'Jest', icon: '🃏', category: 'Testing' },
    { id: 'cypress', name: 'Cypress', icon: '🌲', category: 'Testing' },
    { id: 'selenium', name: 'Selenium', icon: '🕷️', category: 'Testing' },
    { id: 'postman', name: 'Postman', icon: '📮', category: 'API' },
    { id: 'insomnia', name: 'Insomnia', icon: '😴', category: 'API' },
    { id: 'nginx', name: 'Nginx', icon: '🌐', category: 'Server' },
    { id: 'apache', name: 'Apache', icon: '🪶', category: 'Server' },
    { id: 'rabbitmq', name: 'RabbitMQ', icon: '🐰', category: 'Message Queue' },
    { id: 'kafka', name: 'Apache Kafka', icon: '📡', category: 'Message Queue' },
    { id: 'elasticsearch', name: 'Elasticsearch', icon: '🔍', category: 'Search' },
    { id: 'solr', name: 'Apache Solr', icon: '☀️', category: 'Search' },
    { id: 'prometheus', name: 'Prometheus', icon: '📊', category: 'Monitoring' },
    { id: 'grafana', name: 'Grafana', icon: '📈', category: 'Monitoring' },
    { id: 'splunk', name: 'Splunk', icon: '🔎', category: 'Analytics' },
    { id: 'tableau', name: 'Tableau', icon: '📊', category: 'Analytics' },
    { id: 'powerbi', name: 'Power BI', icon: '⚡', category: 'Analytics' },
    { id: 'r', name: 'R Programming', icon: '📊', category: 'Data Science' },
    { id: 'julia', name: 'Julia', icon: '🔬', category: 'Data Science' },
    { id: 'matlab', name: 'MATLAB', icon: '🧮', category: 'Data Science' },
    { id: 'pandas', name: 'Pandas', icon: '🐼', category: 'Data Science' },
    { id: 'numpy', name: 'NumPy', icon: '🔢', category: 'Data Science' },
    { id: 'jupyter', name: 'Jupyter', icon: '📓', category: 'Data Science' },
    { id: 'anaconda', name: 'Anaconda', icon: '🐍', category: 'Data Science' },
    { id: 'spark', name: 'Apache Spark', icon: '⚡', category: 'Big Data' },
    { id: 'hadoop', name: 'Hadoop', icon: '🐘', category: 'Big Data' },
    { id: 'snowflake', name: 'Snowflake', icon: '❄️', category: 'Data Warehouse' },
    { id: 'databricks', name: 'Databricks', icon: '🧱', category: 'Data Platform' },
    { id: 'airflow', name: 'Apache Airflow', icon: '🌪️', category: 'Data Pipeline' },
    { id: 'dbt', name: 'dbt', icon: '🔄', category: 'Data Pipeline' },
    { id: 'looker', name: 'Looker', icon: '👀', category: 'BI Tools' },
    { id: 'metabase', name: 'Metabase', icon: '📊', category: 'BI Tools' },
    { id: 'algorithms', name: 'Data Structures & Algorithms', icon: '🧠', category: 'Fundamentals' },
    { id: 'systemdesign', name: 'System Design', icon: '🏗️', category: 'Architecture' },
    { id: 'microservices', name: 'Microservices', icon: '🔗', category: 'Architecture' },
    { id: 'restapi', name: 'REST API Design', icon: '🌐', category: 'API' },
    { id: 'oauth', name: 'OAuth & Authentication', icon: '🔐', category: 'Security' },
    { id: 'jwt', name: 'JWT & Session Management', icon: '🎫', category: 'Security' },
    { id: 'sql', name: 'SQL & Database Design', icon: '🗄️', category: 'Database' },
    { id: 'nosql', name: 'NoSQL Databases', icon: '📄', category: 'Database' },
    { id: 'caching', name: 'Caching Strategies', icon: '⚡', category: 'Performance' },
    { id: 'loadbalancing', name: 'Load Balancing', icon: '⚖️', category: 'Infrastructure' },
    { id: 'cicd', name: 'CI/CD Pipelines', icon: '🔄', category: 'DevOps' },
    { id: 'monitoring', name: 'Application Monitoring', icon: '📈', category: 'Operations' },
    { id: 'logging', name: 'Logging & Debugging', icon: '🐛', category: 'Operations' },
    { id: 'performance', name: 'Performance Optimization', icon: '🚀', category: 'Performance' },
    { id: 'scaling', name: 'Horizontal & Vertical Scaling', icon: '📏', category: 'Architecture' },
    { id: 'designpatterns', name: 'Design Patterns', icon: '🎨', category: 'Fundamentals' },
    { id: 'solid', name: 'SOLID Principles', icon: '🏛️', category: 'Fundamentals' },
    { id: 'tdd', name: 'Test Driven Development', icon: '🧪', category: 'Testing' },
    { id: 'agile', name: 'Agile & Scrum', icon: '🏃', category: 'Methodology' },
    { id: 'codereview', name: 'Code Review Best Practices', icon: '👥', category: 'Collaboration' },
    { id: 'documentation', name: 'Technical Documentation', icon: '📝', category: 'Communication' },
    { id: 'regex', name: 'Regular Expressions', icon: '🔤', category: 'Tools' },
    { id: 'bash', name: 'Bash & Shell Scripting', icon: '💻', category: 'Systems' },
    { id: 'vim', name: 'Vim & Text Editors', icon: '✏️', category: 'Tools' },
    { id: 'networking', name: 'Computer Networks', icon: '🌐', category: 'Infrastructure' },
    { id: 'protocols', name: 'HTTP/HTTPS & Web Protocols', icon: '🔗', category: 'Web' },
    { id: 'websockets', name: 'WebSockets & Real-time', icon: '⚡', category: 'Web' },
    { id: 'pwa', name: 'Progressive Web Apps', icon: '📱', category: 'Web' },
    { id: 'seo', name: 'SEO & Web Performance', icon: '🔍', category: 'Web' },
    { id: 'accessibility', name: 'Web Accessibility (a11y)', icon: '♿', category: 'Web' },
    { id: 'responsive', name: 'Responsive Design', icon: '📐', category: 'Frontend' },
    { id: 'crossbrowser', name: 'Cross-Browser Compatibility', icon: '🌍', category: 'Frontend' },
    { id: 'bundlers', name: 'Module Bundlers', icon: '📦', category: 'Tools' },
    { id: 'packagemanagers', name: 'Package Managers', icon: '📋', category: 'Tools' },
    { id: 'virtualization', name: 'Virtualization & Containers', icon: '📦', category: 'Infrastructure' },
    { id: 'cloudnative', name: 'Cloud-Native Development', icon: '☁️', category: 'Cloud' },
    { id: 'serverless', name: 'Serverless Architecture', icon: '⚡', category: 'Cloud' },
    { id: 'edge', name: 'Edge Computing', icon: '🌐', category: 'Infrastructure' },
    { id: 'iot', name: 'Internet of Things (IoT)', icon: '🔗', category: 'Emerging Tech' },
    { id: 'ar', name: 'Augmented Reality (AR)', icon: '🥽', category: 'Emerging Tech' },
    { id: 'vr', name: 'Virtual Reality (VR)', icon: '🕶️', category: 'Emerging Tech' },
    { id: 'webassembly', name: 'WebAssembly (WASM)', icon: '⚙️', category: 'Web' },
    { id: 'lowcode', name: 'Low-Code/No-Code Platforms', icon: '🎛️', category: 'Tools' },
    { id: 'apigateway', name: 'API Gateway & Management', icon: '🚪', category: 'Architecture' },
    { id: 'eventdriven', name: 'Event-Driven Architecture', icon: '📡', category: 'Architecture' },
    { id: 'ddd', name: 'Domain Driven Design', icon: '🏗️', category: 'Architecture' },
    { id: 'cqrs', name: 'CQRS & Event Sourcing', icon: '🔄', category: 'Architecture' },
    { id: 'functional', name: 'Functional Programming', icon: '🔧', category: 'Programming Paradigms' },
    { id: 'oop', name: 'Object-Oriented Programming', icon: '🎯', category: 'Programming Paradigms' },
    { id: 'concurrency', name: 'Concurrency & Parallelism', icon: '🔀', category: 'Programming Concepts' },
    { id: 'memory', name: 'Memory Management', icon: '🧠', category: 'Programming Concepts' },
    { id: 'compilation', name: 'Compilers & Interpreters', icon: '⚙️', category: 'Computer Science' },
    { id: 'os', name: 'Operating Systems', icon: '💻', category: 'Computer Science' }
  ];

  // Group cards by category for better organization
  const getCardsByCategory = () => {
    const grouped = {};
    techCards.forEach(card => {
      if (!grouped[card.category]) {
        grouped[card.category] = [];
      }
      grouped[card.category].push(card);
    });
    return grouped;
  };

  useEffect(() => {
    const initializeEduSpace = async () => {
      try {
        if (!authService.isAuthenticated()) {
          window.location.href = '/';
          return;
        }
        
        const userData = await authService.getUserProfile();
        setUser(userData);
        setFilteredCards(techCards);
      } catch (error) {
        console.error('Failed to initialize EduSpace:', error);
        authService.logout();
        window.location.href = '/';
      } finally {
        setLoading(false);
      }
    };
    
    initializeEduSpace();
  }, []);

  useEffect(() => {
    let filtered = techCards;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(card => card.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(card => 
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredCards(filtered);
  }, [searchTerm, selectedCategory]);

  const categories = ['All', ...new Set(techCards.map(card => card.category))];

  const handleCardClick = async (tech) => {
    setSelectedTech(tech);
    setCurrentView('content');
    setContentLoading(true);
    setContent('');
    
    try {
      console.log('Generating content for:', tech.name);
      const generatedContent = await eduSpaceService.generateContent(tech.name);
      console.log('Content received:', generatedContent?.substring(0, 100) + '...');
      setContent(generatedContent || 'No content generated');
    } catch (error) {
      console.error('Failed to generate content:', error);
      if (error.message === 'Authentication failed') {
        authService.logout();
        window.location.href = '/';
      } else {
        setContent(`Error: ${error.message}`);
      }
    } finally {
      setContentLoading(false);
    }
  };

  const handleBackToCards = () => {
    setCurrentView('cards');
    setSelectedTech(null);
    setContent('');
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
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</div>
          <p>Loading EduSpace...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={styles.container}>
      <DashboardNavbar user={user} onLogout={handleLogout} />
      
      <div className={styles.content}>
        {currentView === 'cards' && (
          <>
            <div className={styles.header}>
              <div className={styles.heroSection}>
                <h1 className={styles.heroTitle}>🎓 EduSpace</h1>
                <p className={styles.heroSubtitle}>Master cutting-edge technologies with AI-powered learning experiences</p>
              </div>
              
              <div className={styles.controlsSection}>
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder="🔍 Search technologies, frameworks, tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
                
                <div className={styles.categoryFilter}>
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.statsSection}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{filteredCards.length}</span>
                <span className={styles.statLabel}>Technologies</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{categories.length - 1}</span>
                <span className={styles.statLabel}>Categories</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>∞</span>
                <span className={styles.statLabel}>Possibilities</span>
              </div>
            </div>

            <div className={styles.cardsContainer}>
              {categories.slice(1).map((category) => {
                const categoryCards = filteredCards.filter(card => card.category === category);
                if (categoryCards.length === 0) return null;
                
                return (
                  <div key={category} className={styles.categorySection}>
                    <h2 className={styles.categoryTitle}>{category}</h2>
                    <div className={styles.cardsGrid}>
                      {categoryCards.map((tech, index) => (
                        <div 
                          key={tech.id} 
                          className={styles.techCard}
                          onClick={() => handleCardClick(tech)}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className={styles.cardHeader}>
                            <div className={styles.cardIcon}>{tech.icon}</div>
                            <div className={styles.cardBadge}>{tech.category}</div>
                          </div>
                          <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{tech.name}</h3>
                            <div className={styles.cardFooter}>
                              <span className={styles.learnButton}>Explore →</span>
                            </div>
                          </div>
                          <div className={styles.cardGlow}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {currentView === 'content' && (
          <div className={styles.contentView}>
            <div className={styles.contentHeader}>
              <button className={styles.backButton} onClick={handleBackToCards}>
                <span className={styles.backIcon}>←</span>
              </button>
            </div>
            
            <div className={styles.paperContainer}>
              <div className={styles.paper}>
                <div className={styles.paperHeader}>
                  <div className={styles.techInfo}>
                    <span className={styles.techIcon}>{selectedTech?.icon}</span>
                    <div className={styles.techDetails}>
                      <h2 className={styles.techName}>{selectedTech?.name}</h2>
                      <span className={styles.techCategory}>{selectedTech?.category}</span>
                    </div>
                  </div>
                  <div className={styles.paperMeta}>
                    <span className={styles.aiGenerated}>🤖 AI Generated</span>
                  </div>
                </div>
                
                <div className={styles.paperContent}>
                  {contentLoading ? (
                    <div className={styles.contentLoading}>
                      <div className={styles.loadingSpinner}></div>
                      <div className={styles.typewriter}>Crafting your learning experience...</div>
                    </div>
                  ) : content ? (
                    <div className={styles.contentText}>
                      {content.split('\n').filter(p => p.trim()).map((paragraph, index) => {
                        let cleanText = paragraph
                          .replace(/^#+\s*/, '')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/^-\s*/, '• ')
                          .replace(/^\d+\.\s*/, '')
                          .trim();
                        
                        let className = styles.paragraph;
                        let icon = '';
                        
                        if (cleanText.toLowerCase().includes('introduction')) {
                          icon = '📚';
                          className = `${styles.paragraph} ${styles.introduction}`;
                        } else if (cleanText.toLowerCase().includes('getting started')) {
                          icon = '🚀';
                          className = `${styles.paragraph} ${styles.gettingStarted}`;
                        } else if (cleanText.toLowerCase().includes('features')) {
                          icon = '⭐';
                          className = `${styles.paragraph} ${styles.features}`;
                        } else if (cleanText.toLowerCase().includes('best practices')) {
                          icon = '💡';
                          className = `${styles.paragraph} ${styles.bestPractices}`;
                        } else if (cleanText.toLowerCase().includes('advanced')) {
                          icon = '🔥';
                          className = `${styles.paragraph} ${styles.advanced}`;
                        } else if (cleanText.toLowerCase().includes('resources')) {
                          icon = '📖';
                          className = `${styles.paragraph} ${styles.resources}`;
                        }
                        
                        return (
                          <div key={index} className={className}>
                            {icon && <span className={styles.sectionIcon}>{icon}</span>}
                            <p dangerouslySetInnerHTML={{ __html: cleanText }}></p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className={styles.contentText}>
                      <div className={styles.errorMessage}>
                        <span className={styles.errorIcon}>⚠️</span>
                        <p>Content unavailable. Please try again.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EduSpace;