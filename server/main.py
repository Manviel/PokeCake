from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import twin_routes
import uvicorn
import socketio
import asyncio
from services.rabbitmq import consume_telemetry
from simulation.device_sim import run_simulation

# 1. Rename the inner FastAPI app to 'api' (was 'app')
api = FastAPI(
    title="Apple Digital Twin API",
    description="A digital twin management system for Apple products and services.",
    version="1.0.0"
)

# 2. Initialize Socket.IO with permissive CORS for development
# async_mode='asgi' is critical for integration with Uvicorn/FastAPI
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

# 3. Wrap the API with the Socket.IO ASGI App
# We check this into the variable 'app' so that 'uvicorn main:app' runs THIS wrapper.
app = socketio.ASGIApp(sio, api)

# 4. Inject sio instance for access in other modules
app.sio = sio
api.sio = sio

@api.on_event("startup")
async def startup_event():
    print("⚡ PokeCake API with Socket.IO initialized ⚡")
    # Pass the 'app' wrapper (which has .sio) to the consumer
    asyncio.create_task(consume_telemetry(app))
    # Start the device simulator in the background
    asyncio.create_task(run_simulation())

# 5. Configure CORS for the REST API (HTTP)
api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
api.include_router(twin_routes.router, prefix="/api/v1", tags=["Digital Twins"])

@api.get("/")
async def root():
    return {"message": "Welcome to the Apple Digital Twin API", "docs": "/docs"}

if __name__ == "__main__":
    # Runs the wrapped application
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
