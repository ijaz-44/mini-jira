# Mini-Jira

A full-stack Agile task management app built with Next.js, Express, MongoDB, and Zustand.

## 🚀 Live Links

- **App:** [https://mini-jira-henna.vercel.app](https://mini-jira-henna.vercel.app)
- **Deployment:** Deployed on Vercel (Frontend & Backend).


🛠️ Tech Stack
Frontend: Next.js (App Router), React, Tailwind CSS, Zustand, Axios

Backend: Node.js, Express.js, TypeScript

Database: MongoDB with Mongoose ODM

Validation & Security: Zod, JWT (HttpOnly Cookies), bcrypt


📁 Folder Structure

mini-jira/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and environment variable setup
│   │   ├── constants/       # User roles and task statuses
│   │   ├── controllers/     # Auth, project, and task business logic
│   │   ├── middleware/      # Auth checks, role permissions, error handling
│   │   ├── models/          # Mongoose database schemas
│   │   ├── routes/          # Express API routes
│   │   └── utils/           # Helper functions, JWT, async handlers
└── frontend/
    ├── src/
    │   ├── app/             # Next.js pages (Auth & Dashboard)
    │   ├── components/      # UI components (Kanban Board, Cards, Modals)
    │   ├── hooks/           # Custom React hooks (useTasks, useProjects)
    │   ├── store/           # Zustand stores for state management
    │   ├── services/        # Axios API requests
    │   └── lib/             # Zod validation schemas and utility functions

✨ Features
Authentication: JWT stored safely in HttpOnly cookies (Protected against XSS attacks).

Project & Task Management: Create projects, add tasks, and manage statuses (TODO, IN_PROGRESS, IN_REVIEW, DONE).

Kanban Board: Clean interactive board for managing tasks.

Role-Based Permissions: Admin, Manager, and Member access control.

Data Validation: Zod schemas used on both frontend forms and backend middleware.

Global State: Fast state updates using Zustand without Context re-renders.

⚡ Local Setup
Prerequisites
Node.js (v18+)

MongoDB installed locally or a MongoDB Atlas connection string

