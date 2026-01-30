# Apple Digital Twin Project

A modern digital twin management system for Apple products and services. This project uses a high-performance **Qwik** frontend and a robust **FastAPI** backend with **MongoDB**.

## 🚀 Quick Start (Development)

The easiest way to develop this project is using the automated workflows or manual local setup.

### 🤖 Using AI Workflows
If you are using an AI agent (like Antigravity), you can trigger pre-defined workflows located in:
`/.agent/workflows/`

- **`/dev-local`**: Starts the entire stack (DB, API, Frontend) with hot-reload enabled.

***

### 🛠️ Manual Setup

#### 1. Bring the App UP
To start the environment with hot-reload enabled for both frontend and backend:

**Terminal 1 (Database):**
```bash
docker-compose up -d mongodb
```

**Terminal 2 (Backend):**
```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload
```

**Terminal 3 (Frontend):**
```bash
cd client
npm install
npm run dev
```

#### 2. Bring the App DOWN
To stop all running services and clean up:

1. Press `Ctrl+C` in the Backend and Frontend terminals.
2. Run the following to stop the database:
```bash
docker-compose down
```

***

## 🔗 Access Points
- **Frontend Dashboard**: [http://localhost:5173](http://localhost:5173)
- **API Documentation (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Backend Health Check**: [http://localhost:8000/api/v1/twins](http://localhost:8000/api/v1/twins)

## 🏗️ Technology Stack

### Frontend
- **Framework**: [Qwik City](https://qwik.dev/)
- **Styling**: Apple Design System (Vanilla CSS + Tailwind for layout)
- **State Management**: Qwik Signals & Hooks
- **Linting/Formatting**: ESLint 9 & Prettier

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+)
- **Database**: MongoDB (via Motor driver)
- **Validation**: Pydantic v2
- **Infrastructure**: Docker & Docker Compose

## 📁 Project Structure
```text
PokeCake/
├── .agent/workflows/  # Automated development scripts
├── client/            # Qwik Frontend (Vite powered)
│   ├── src/hooks/     # Custom shared logic (e.g., useAlert)
│   ├── src/components/# Atomic & Feature components
│   └── ...
├── server/            # FastAPI Backend
│   ├── models/        # Pydantic DTOs
│   ├── routes/        # API Endpoints
│   └── ...
└── docker-compose.yml # Infrastructure orchestration
```

## ✨ Features
- **Premium Aesthetics**: Clean, glassmorphic design inspired by macOS/iOS.
- **Real Business Logic**: Server-side device serial and identity generation.
- **Hot Reloading**: Instant feedback loop for both UI and API changes.
