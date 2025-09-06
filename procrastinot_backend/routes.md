# 📍 Procrastinot API Routes Cheat Sheet

| **Method** | **Endpoint** | **Purpose** |
|------------|--------------|-------------|
| **GET** | `/` | Health check – confirm server is running |
| **POST** | `/api/users/register` | Register a new user |
| **POST** | `/api/users/login` | Login user and get JWT token |
| **GET** | `/api/users/profile/:userId` | Get user profile (protected) |
| **GET** | `/api/users` | Get all users (protected) |
| **PUT** | `/api/users/:id` | Update user details (protected) |
| **GET** | `/api/users/google` | Initiate Google OAuth |
| **GET** | `/api/users/google/callback` | Handle Google OAuth callback |
| **POST** | `/api/users/google-login` | Login via Google (frontend integration) |
| **POST** | `/api/tasks` | Create a task (protected) |
| **GET** | `/api/tasks/user/:userId` | Get all tasks for a user (protected) |
| **PUT** | `/api/tasks/:id` | Update a task (protected) |
| **DELETE** | `/api/tasks/:id` | Delete a task (protected) |
| **POST** | `/api/skills` | Create a skill (protected) |
| **GET** | `/api/skills/user/:userId` | Get all skills of a user (protected) |
| **GET** | `/api/skills` | Get all skills (protected) |
| **GET** | `/api/skills/category/:category` | Get skills by category (protected) |
| **PUT** | `/api/skills/:id` | Update a skill (protected) |
| **DELETE** | `/api/skills/:id` | Delete a skill (protected) |
| **POST** | `/api/pomodoro` | Create a pomodoro session (protected) |
| **GET** | `/api/pomodoro/user/:userId` | Get pomodoro sessions of a user (protected) |
| **PUT** | `/api/pomodoro/:id` | Update a pomodoro session (protected) |
| **DELETE** | `/api/pomodoro/:id` | Delete a pomodoro session (protected) |
| **POST** | `/api/moods` | Create a mood log (protected) |
| **GET** | `/api/moods/user/:userId` | Get all mood logs of a user (protected) |
| **PUT** | `/api/moods/:id` | Update a mood log (protected) |
| **DELETE** | `/api/moods/:id` | Delete a mood log (protected) |
| **POST** | `/api/challenges` | Create a challenge (protected) |
| **GET** | `/api/challenges` | Get all challenges (protected) |
| **GET** | `/api/challenges/difficulty/:level` | Get challenges by difficulty (protected) |
| **PUT** | `/api/challenges/:id` | Update a challenge (protected) |
| **DELETE** | `/api/challenges/:id` | Delete a challenge (protected) |

---

✅ Use this table as a quick integration reference for frontend developers.
