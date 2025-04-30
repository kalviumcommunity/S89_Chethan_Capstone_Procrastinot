# 🧠 Procrastinot: Anti-Procrastination Toolkit

Procrastinot is a full-stack productivity web application designed to help users defeat procrastination through proven techniques like Pomodoro timing, AI task assistance, mood tracking, and skill-building gamification. Built with modern tech and best practices, it fulfills Kalvium's capstone Level 1 & Level 2 expectations.

---

## 🚀 Live Links

- **Frontend**: [Coming Soon]
- **Backend**: [Coming Soon]
- **Demo Video**: [Coming Soon]

---

## 🎯 Goals

- Help users manage time via the Pomodoro technique.
- Track tasks, moods, and progress visually.
- Offer AI-assisted task breakdowns and skill suggestions.
- Deliver daily productivity challenges.
- Support real offline usage with localStorage/IndexedDB.
- Provide gamified skill-building learning paths.

---

## 🛠 Key Features

| Category | Features |
| :--- | :--- |
| Productivity Tools | Pomodoro Timer, Task Manager (CRUD), Mood Tracker, Daily Challenges, Calendar View |
| AI Integration | AI Task Breakdowns, Skill Recommendations |
| Skill Builder | Skill Cards, Subtopic Modules, Progress Tracking |
| UX Enhancements | Dark/Light Mode, Voice Input (Speech-to-Text), Browser Notifications, Offline Support |
| Authentication | Email/Password Login, Google OAuth, JWT-based Sessions |
| DevOps | Dockerized Deployments, Jest Testing |
| Real Usage | Analytics, Feedback Forms, Community Usage Drive |

---

## 🧩 Tech Stack

| Layer | Tech |
| :--- | :--- |
| Frontend | React.js, Vite, TailwindCSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ORM) |
| Authentication | JWT, Google OAuth 2.0 |
| Hosting | Vercel (Frontend), Render/Railway (Backend) |
| Containerization | Docker, Docker Compose |
| Testing | JEST (5+ unit tests) |

---

## 📚 Database Models (Mongoose)

- **User**: username, email, password, googleId
- **Task**: title, description, status, userId (ref)
- **MoodLog**: mood, timestamp, userId (ref)
- **SkillProgress**: skillName, subtopicsCompleted, userId (ref)

---

## 🔐 Authentication

- Email/Password Signup + Login
- Google OAuth Login
- JWT Token Management (Frontend-Backend)

---

## 🤖 LLM Integrations

- Task breakdown using OpenAI
- Personalized productivity tips
- AI-recommended skill paths

---

## 🧪 Testing

- Jest unit tests for critical backend routes.
- 5+ unit tests minimum.

---

## 🐳 Dockerization

- Frontend Dockerfile
- Backend Dockerfile
- `docker-compose.yml` for local development


---
---
# 📅PR Schedule (Starting April 24, 2025)
 
- **Apr 24**: Submitting the low-fid wireframe for the capstone
- **Apr 25**: Submitting the high-fid wireframe for the capstone
- **Apr 26**:  Creating the Repo for the capstone and creating the README.md file

## **Week 2 (Apr 28 – May 4) – Core App Skeleton + Pomodoro + Auth**

- **Apr 28**: React App + Pages routing (Home, Tasks, Skills, Dashboard)
- **Apr 29**: Pomodoro Timer Component
- **Apr 30**: Task Manager UI (Task Create Form + Task List)
- **May 1**: Setup backend server (Node + Express Basic API routes)
- **May 2**: Create Tasks API: POST, GET
- **May 3**: Setup JWT authentication (Signup/Login frontend + backend)
- **May 4**: Google OAuth integration

---

## **Week 3 (May 5 – May 11) – Core Features & AI Integration**

- **May 5**: Update/Delete tasks (PUT/DELETE endpoints)
- **May 6**: AI Integration for Smart Task Breakdown
- **May 7**: Daily Challenge Generator (static + AI-based)
- **May 8**: Mood Tracker UI + backend
- **May 9**: Browser Notifications (Pomodoro complete)
- **May 10**: Calendar View (for completed tasks + goals)
- **May 11**: Deploy Backend to Render/Railway

---

## **Week 4 (May 12 – May 18) – Skill Builder Magic**

- **May 12**: Skill Builder main page + skill category cards
- **May 13**: Subtopic cards (HTML, JS, Python)
- **May 14**: In-app embedded learning modules
- **May 15**: Save skill progress (backend + frontend)
- **May 16**: AI-suggested Skill Paths
- **May 17**: Mobile responsiveness + polish
- **May 18**: Skill Progress streak feature

---

## **Week 5 (May 19 – May 25) – Testing, Offline, Analytics**

- **May 19**: Add Jest Unit Tests (5+ tests minimum)
- **May 20**: Offline Support (localStorage / IndexedDB)
- **May 21**: Voice Input (Speech-to-Text integration)
- **May 22**: Dark/Light Mode toggle
- **May 23**: Google Analytics integration
- **May 24**: Typeform Feedback form
- **May 25**: Finalize Docker setup (frontend + backend)

---

## **Week 6 (May 26 – May 31) – Final Push and Submission**

- **May 26**: Merge incoming 3 PRs from friends
- **May 27**: Contribute 3 PRs to Open-Source projects
- **May 28**: Collect user feedback + run 5-day productivity challenge
- **May 29**: Bug fixing, final backend and frontend polishing
- **May 30**: Write final documentation, LMS form fill
- **May 31**: Record demo video + Submit final capstone!

---

✅ Every day = 1 PR  
✅ Minimum 30+ PRs total  
✅ Focus on clean commits, small tasks per branch
