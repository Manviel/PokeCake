---
description: Run the app locally for development with hot-reload
---

# Local Development Workflow

This workflow runs the app locally with hot-reload enabled for both frontend and backend.

## Prerequisites
- Docker Desktop running
- Python 3.11+ installed
- Node.js 18+ installed

## Steps

### 1. Start MongoDB (only needs to be done once)
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 2. Start the Backend (Terminal 1)
```bash
cd server
pip install -r requirements.txt  # Only needed first time or when dependencies change
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The `--reload` flag enables hot-reload - the server will automatically restart when you modify Python files.

### 3. Start the Frontend (Terminal 2)
```bash
cd client
npm install  # Only needed first time or when dependencies change
npm run dev
```

Vite has hot-reload built-in - changes to frontend files will automatically refresh the browser.

## Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **MongoDB**: localhost:27017

## Stopping Services

### Stop Backend & Frontend
Press `Ctrl+C` in each terminal

### Stop MongoDB
```bash
docker-compose -f docker-compose.dev.yml down
```

## Benefits of This Approach
✅ Frontend hot-reload - instant updates when you modify React/Qwik code
✅ Backend hot-reload - automatic restart when you modify Python code  
✅ No Docker restarts needed
✅ Faster development cycle
✅ Native performance
