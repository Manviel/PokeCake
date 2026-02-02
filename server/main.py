import asyncio

import socketio
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import client
from routes import twin_routes
from services.rabbitmq import _connection, consume_telemetry
from simulation.device_sim import run_simulation
from sio_instance import sio

api = FastAPI(
    title="Apple Digital Twin API",
    description="A digital twin management system for Apple products and services.",
    version="1.0.0",
)

app = socketio.ASGIApp(sio, api)

_background_tasks = set()


@api.on_event("startup")
async def startup_event():
    print("⚡ PokeCake API with Socket.IO initialized ⚡")
    telemetry_task = asyncio.create_task(consume_telemetry(sio))
    simulation_task = asyncio.create_task(run_simulation())
    _background_tasks.add(telemetry_task)
    _background_tasks.add(simulation_task)
    telemetry_task.add_done_callback(_background_tasks.discard)
    simulation_task.add_done_callback(_background_tasks.discard)


@api.on_event("shutdown")
async def shutdown_event():
    print("🛑 Shutting down gracefully...")
    for task in _background_tasks:
        task.cancel()
    await asyncio.gather(*_background_tasks, return_exceptions=True)

    if client:
        client.close()
    if _connection and not _connection.is_closed:
        await _connection.close()

    print("✅ Shutdown complete")


api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api.include_router(twin_routes.router, prefix="/api/v1", tags=["Digital Twins"])


@api.get("/")
async def root():
    return {"message": "Welcome to the Apple Digital Twin API", "docs": "/docs"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
