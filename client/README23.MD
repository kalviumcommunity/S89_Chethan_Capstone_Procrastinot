
### 🗂️ `client/` – Frontend Folder Structure

```
client/
├── public/
│   └── favicon.ico          # App icon
│   └── manifest.json        # PWA support (optional)
│
├── src/
│   ├── assets/              # Images, logos, SVGs
│   ├── components/          # Reusable UI components (Buttons, Cards)
│   ├── features/            # Feature-based folder structure
│   │   ├── auth/            # Login, Register, Google OAuth
│   │   ├── dashboard/       # User dashboard UI
│   │   ├── tasks/           # Task planner, todo list
│   │   ├── pomodoro/        # Pomodoro timer logic and UI
│   │   ├── mood/            # Mood tracker
│   │   ├── skills/          # Skill builder UI & logic
│   │   ├── challenges/      # Daily challenges
│   │   └── stats/           # Stats & Analytics views
│   │
│   ├── hooks/               # Custom React hooks (e.g., useAuth, useTimer)
│   ├── layouts/             # Layout wrappers (Sidebar, Header, etc.)
│   ├── lib/                 # Utilities (API config, helpers)
│   ├── pages/               # Route-based page components
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── NotFound.jsx
│   ├── routes/              # React Router setup
│   ├── services/            # Axios service layers per feature
│   ├── store/               # Global state (Redux/Zustand if needed)
│   ├── styles/              # Global styles or Tailwind config
│   ├── App.jsx              # Root app component
│   └── main.jsx             # Entry file for Vite
│
├── .env                    # Environment variables (API URL)
├── index.html              # Root HTML template
├── package.json
├── tailwind.config.js      # TailwindCSS config
├── postcss.config.js
└── vite.config.js
```

---

### 🛠️ Tech Setup Summary

| Tool                       | Purpose                            |
| -------------------------- | ---------------------------------- |
| **React**                  | UI building                        |
| **Vite**                   | Lightning-fast frontend bundler    |
| **Tailwind**               | Clean and modern utility-first CSS |
| **Framer Motion**          | Animations and transitions         |
| **Axios**                  | HTTP requests                      |
| **React Router**           | Client-side routing                |
| **Zustand or Context API** | State management (optional)        |
| **JWT Auth**               | Handle auth logic with tokens      |

---

### ✅ Next Steps (Pick One to Begin)

1. 🚀 **Initialize the Vite project** and install dependencies
2. 🎨 Start building the **Landing Page**
3. 🔐 Build **Login / Register** pages
4. ⚙️ Setup API service layer (Axios + auth headers)


