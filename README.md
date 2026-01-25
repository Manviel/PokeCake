# Apple Digital Twin Project

A modern digital twin management system for Apple products and services, featuring a FastAPI backend and MongoDB persistence, fully orchestrated with Docker.

## Technology Stack

- **Backend**: FastAPI (Python 3.11)
- **Database**: MongoDB (NoSQL)
- **Asynchronous Driver**: Motor
- **Containerization**: Docker & Docker Compose
- **Validation**: Pydantic

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose installed on your system.

### Running the Application

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd PokeCake
2. **Start the backend services**:
   ```bash
   cd server
   docker-compose up -d
   ```

3. **Verify the installation**:
   The API will be available at `http://localhost:8000`.

## API Documentation

Once the server is running, you can access the interactive API documentation at:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Project Structure

```text
server/
├── models/           # Pydantic data models
├── routes/           # API endpoint definitions
├── .env              # Environment configuration
├── database.py       # MongoDB connection logic
├── Dockerfile        # Container build instructions
├── docker-compose.yml # Service orchestration
├── main.py           # FastAPI entry point
└── requirements.txt  # Python dependencies
```

## Future Work
- **Frontend**: The frontend will be rewritten later to integrate with this new FastAPI backend.
- **Service Integration**: Adding simulated diagnostics and service status for Apple products.
