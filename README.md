# Apple Digital Twin Project

A modern digital twin management system for Apple products and services, featuring a high-performance Qwik frontend and a robust FastAPI backend with MongoDB.

## Technology Stack

### Frontend
- **Framework**: [Qwik City](https://qwik.dev/)
- **Styling**: Vanilla CSS (Apple Design System)
- **Integration**: REST API via FastAPI

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11)
- **Database**: MongoDB (NoSQL)
- **Asynchronous Driver**: Motor
- **Containerization**: Docker & Docker Compose

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose.
- [Node.js](https://nodejs.org/) (for local frontend development).

### Running the Application

1. **Start the Backend Services**:
   ```bash
   cd server
   docker-compose up -d
   ```

2. **Start the Frontend**:
   ```bash
   cd client
   npm install
   npm start
   ```

3. **Explore**:
   - **Frontend**: `http://localhost:5173`
   - **API Documentation**: `http://localhost:8000/docs`

## Project Structure

```text
PokeCake/
├── client/           # Qwik Frontend
│   ├── src/          # Application source
│   └── ...
├── server/           # FastAPI Backend
│   ├── models/       # Pydantic data models
│   ├── routes/       # API endpoint definitions
│   └── ...
└── docker-compose.yml # Backend orchestration
```

## Features
- **Premium Design**: Clean, Apple-inspired aesthetics with glassmorphism.
- **Digital Twin Dashboard**: Real-time management of simulated Apple hardware.
- **FastAPI Core**: Highly scalable and type-safe backend logic.
- **Dockerized Backend**: Simplified deployment for the core services.
