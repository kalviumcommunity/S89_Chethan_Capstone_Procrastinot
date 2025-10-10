# Procrastinot

Procrastinot is a full-stack productivity web application designed to help users overcome procrastination and manage focused work. It combines task management, Pomodoro sessions, mood tracking, skill growth tools, micro-challenges, and an optional conversational assistant — all wired together with robust backend APIs and an interactive React frontend.

This repository contains two main parts:

- `procrastinot_backend/` — Node.js + Express API, MongoDB models, authentication (JWT + Google OAuth), scheduling (email reminders), and comprehensive test suites.
- `procrastinot_frontend/` — React + Vite single-page app with components for Dashboard, SmartPlan, Pomodoro timer, ChatBot, and marketing pages.

## Why Procrastinot is useful

Procrastinot focuses on the behavioural and practical causes of procrastination and provides tools to reduce friction and increase motivation:

- Centralized task management: store tasks with due dates, priorities, estimated time, and important links so users always know what to do next.
- Smart focus sessions (Pomodoro): short, timed work intervals with logging to help build momentum and measure productivity.
- Mood tracking: capture mood before and after sessions to help users spot patterns and manage energy.
- Skill growth & progress: track learning goals and small practice steps so users see measurable progress over time.
- Micro-challenges: short, gamified tasks to break inertia and create momentum when motivation is low.
- Email reminders: optional scheduled reminders (24 hours & 1 hour before) to reduce missed deadlines.
- Security and reliability: JWT auth, Google OAuth option, rate limiting, and input validation designed for safe, production-ready APIs.

By combining behavioral techniques (Pomodoro, micro-challenges) with practical tooling (task scheduling, reminders, and skill tracking), Procrastinot helps users move from intention to action.

## Key features

- User registration and login (email/password + Google OAuth 2.0)
- Create, update, and delete tasks with metadata (priority, due date, estimated time, important links, tags)
- Pomodoro session tracking with mood logging and session notes
- Skill management with progress tracking and categories
- Mood logging (before/after sessions) and simple analytics-ready data
- Challenges for short, focused actions
- ChatBot component (frontend) for conversational assistance
- Email reminder scheduler (configurable via SMTP env vars)
- Rate limiting and CORS configuration for safety

## Tech stack

- Backend: Node.js, Express.js, Mongoose (MongoDB), Passport (Google OAuth), JSON Web Tokens (JWT)
- Frontend: React, Vite
- Other: Nodemailer (optional for reminders), date-fns, bcryptjs, dotenv

## Repository structure (high level)

- procrastinot_backend/
	- `server.js` — app entry, middleware, routes mounting, email reminder scheduler
	- `models/` — Mongoose models: `User`, `Task`, `PomodoroSession`, `Skill`, `SkillProgress`, `MoodLog`, `ChatMessage`, `Challenge`
	- `routes/` — organized by feature (get/post/put/delete subfolders)
	- `config/` — `db.js`, `passport.js`
	- `middleware/` — authentication and rate limiting
	- tests and utilities — several test scripts and API docs (`API_DOCUMENTATION.md`)

- procrastinot_frontend/
	- React app built with Vite
	- `src/components/` — Dashboard, Pomodoro, SmartPlan, ChatBot, AuthModal, and marketing components
	- `services/` — API clients and auth helpers

## Environment variables

Create a `.env` file in `procrastinot_backend/` with at least the following values:

```
PORT=8080
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8080/api/users/google/callback
SERVER_URL=http://localhost:8080
# Optional: SMTP settings for email reminders
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
EMAIL_FROM="Procrastinot <no-reply@example.com>"
```

Note: `server.js` verifies some env vars on startup and will exit if critical variables are missing.

## Local setup

Backend

1. Open a terminal in `procrastinot_backend/`
2. Install dependencies:

```powershell
cd procrastinot_backend
npm install
```

3. Add `.env` with the required variables shown above.

4. Start development server with auto-reload:

```powershell
npm run dev
```

Frontend

1. Open a terminal in `procrastinot_frontend/`
2. Install dependencies and start app:

```powershell
cd procrastinot_frontend
npm install
npm run dev
```

3. The frontend runs by default on Vite's default port (usually `http://localhost:5173`). It talks to the backend at `http://localhost:8080` by default — adjust `CLIENT_URL` / proxy settings if needed.

## API notes

See `procrastinot_backend/API_DOCUMENTATION.md` for the full endpoint list, request/response formats, authentication flow (JWT & Google OAuth), rate limiting rules, and example requests.

Important endpoints:

- Health check: `GET /` (returns JSON message)
- All API features are mounted under `/api` and are grouped by resource (users, tasks, skills, pomodoro, moods, challenges)

Authentication

- Include `Authorization: Bearer <token>` for protected routes.
- Google OAuth endpoints are available under `/api/users/google` and `/api/users/google/callback`.

## Tests

The backend contains a few test scripts in the root of `procrastinot_backend/` (for quick local verification). Run them from the backend directory, for example:

```powershell
cd procrastinot_backend
node comprehensive-test.js
```

## Suggested next steps and improvements

- Add a `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md` for open source contributions.
- Add screenshots and example flows to this README (dashboard, pomodoro, smart plan, email reminder sample).
- Add CI to run linting and tests on push (GitHub Actions) and a seed script to load demo data.
- Add API examples (curl / Postman collection) for quicker integration.

## License

Include a license file if you plan to open-source the project (MIT or similar). If already decided, add `LICENSE` to the repository.

## Contact / Maintainers

If you'd like feedback, improvements, or to contribute, open an issue or create a pull request on the repository. Add maintainer contact details or team information here.

---

Last updated: 2025-10-10
