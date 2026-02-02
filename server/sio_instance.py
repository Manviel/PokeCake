import socketio

# Initialize Socket.IO with permissive CORS for development
# async_mode='asgi' is critical for integration with Uvicorn/FastAPI
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
