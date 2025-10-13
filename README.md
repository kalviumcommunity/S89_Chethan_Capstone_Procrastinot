# 🥋 **Procrastinot — Make Focus Automatic**

**Procrastinot** is a full-stack productivity web app that helps users beat procrastination using task management, timed focus sessions (Pomodoro), mood tracking, micro-challenges, and skill-progress tracking.
It blends behavioral science with practical productivity tools — helping users move from *intention* to *action*.

---

## 🖼️ Screenshots

The following screenshots are included in the repository root (no additional upload needed). If you'd prefer a dedicated folder, move them to `docs/screenshots/` and update the links.

<div align="center">


![Landing hero (1)](docs/screenshots/Screenshot%202025-10-13%20162318.png "Landing hero")

![Sign up modal (2)](docs/screenshots/Screenshot%202025-10-13%20162451.png "Sign up modal")

![Logged-in hero (3)](docs/screenshots/Screenshot%202025-10-13%20162531.png "Logged-in hero")

![Main features grid (4)](docs/screenshots/Screenshot%202025-10-13%20162600.png "Features grid")

![Cards overview (5)](docs/screenshots/Screenshot%202025-10-13%20162633.png "Cards overview")

</div>

---

## 🚀 Quick Summary (for Recruiters)

* **Tech stack:** Node.js, Express, MongoDB (Mongoose), React + Vite, JWT + Passport (Google OAuth), Nodemailer, date-fns, bcryptjs, dotenv.
* **Problem solved:** Helps students, freelancers, and knowledge workers stay consistent by combining task planning, Pomodoro sessions, mood logging, and challenges.
* **Impact:** Personal productivity booster with analytics-ready logs, scheduled email reminders, and test-ready APIs for easy evaluation.
* **Learning outcome:** Built secure JWT + OAuth flows, email schedulers, and resilient Express APIs — applying production-grade Node + React patterns.

---

## ✨ Highlights

* 🔐 **User Auth:** Email/password + Google OAuth 2.0
* ✅ **Tasks:** Full CRUD with metadata (priority, due date, time estimate, tags, links)
* ⏱️ **Pomodoro Sessions:** Timed focus intervals with mood logging and session notes
* 😊 **Mood Tracking:** Capture moods before/after sessions for insights
* 🧠 **Skill Builder:** Track skill goals and progress milestones
* ⚡ **Micro-Challenges:** Small gamified actions to build momentum
* 📧 **Email Reminders:** Scheduled alerts (24h & 1h before deadlines)
* 💬 **ChatBot:** Conversational assistant component in frontend
* 🧱 **API-First Design:** Organized Express routes and Mongoose models
* 🧪 **Tests & Docs:** Comprehensive scripts and `API_DOCUMENTATION.md` included

---

## 🏗️ Repository Structure

```
procrastinot/
│
├── procrastinot_backend/
│   ├── server.js                # Entry point (Express app + scheduler)
│   ├── models/                  # User, Task, PomodoroSession, Skill, MoodLog, etc.
│   ├── routes/                  # Organized REST routes (get/post/put/delete)
│   ├── middleware/              # Auth + rate limiting
│   ├── config/                  # Database + Passport setup
│   ├── tests/                   # Smoke + CRUD + OAuth tests
│   └── API_DOCUMENTATION.md
│
└── procrastinot_frontend/
    ├── src/components/          # Dashboard, Pomodoro, SmartPlan, ChatBot, etc.
    ├── src/services/            # API clients + helpers
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file inside `procrastinot_backend/` with:

```bash
PORT=8080
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:8080

# Optional (Google OAuth)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8080/api/users/google/callback

# Optional (Email reminders)
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
EMAIL_FROM="Procrastinot <no-reply@example.com>"
```

> ⚠️ **Note:** `server.js` validates required variables on startup. Missing keys will cause the server to exit safely.

---

## 🧩 Local Setup (Development)

### Backend

```bash
cd procrastinot_backend
npm install
npm run dev
```

### Frontend

```bash
cd procrastinot_frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` and connects to backend at `http://localhost:8080`.
Adjust URLs via `.env` or client config if ports differ.

---

## 🧪 Running Tests (Backend)

Run quick smoke or feature tests:

```bash
cd procrastinot_backend
node comprehensive-test.js
node crud-operations-test.js
node google-oauth-test.js
```

Or run all:

```bash
node run-all-tests.js
```

---

## 🌐 API Overview

Base URL: `/api`

| Feature    | Endpoint Example                          | Notes                |
| ---------- | ----------------------------------------- | -------------------- |
| Auth       | `/api/users/register`, `/api/users/login` | JWT + Google OAuth   |
| Tasks      | `/api/tasks/`                             | CRUD with metadata   |
| Pomodoro   | `/api/pomodoro/`                          | Session logs + moods |
| Skills     | `/api/skills/`                            | Track progress       |
| Moods      | `/api/moods/`                             | Log moods            |
| Challenges | `/api/challenges/`                        | Get daily challenges |

* Include header `Authorization: Bearer <token>` for protected routes
* See full examples in `API_DOCUMENTATION.md`

---

## 🔒 Security & Reliability

* JWT-based protected endpoints
* Rate limiting and input validation
* CORS enabled for safe frontend-backend communication
* Sensitive values kept in `.env` (not in repo)
* Google OAuth implemented with Passport.js

---

## Third party tools
* **Render** for backend deployment.
* **Vercel** for frontend deployment.
* **MongoDB Atlas** for database hosting.
* **Nodemailer** for email reminders.
* **Passport.js** for Google OAuth.
* **Gemini API** for chatbot functionality.

## ☁️ Deployment Notes

* Used **Render** for backend deployment.
* Used **Vercel** for frontend deployment.

---

## 🛠️ Next Improvements (Good-First Tasks)

* Add **Postman / OpenAPI spec** for quick API testing
* Add **CI pipeline (lint + tests)** via GitHub Actions
* Add **demo seed script + sample data**
* Add **screenshots or walkthrough GIFs** to this README
* Add **MIT LICENSE** and **CONTRIBUTING.md**

---

## 📘 Learning Outcomes

* Implemented **secure authentication** using JWT + Google OAuth
* Built **scheduler with email reminders** via Nodemailer
* Designed **resilient Express APIs** with rate limiting
* Practiced **frontend-backend integration** using React + Vite + REST APIs
* Followed **clean architecture** with modular folder structure and reusable code

---

## 👨‍💻 Maintainer / Contact

Open an issue or pull request for questions, improvements, or contributions.
Project maintained by **Chethan** — feel free to reach out via GitHub.

---

**Last updated:** October 13, 2025
