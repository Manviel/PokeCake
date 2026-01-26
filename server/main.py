from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import twin_routes
import uvicorn

app = FastAPI(
    title="Apple Digital Twin API",
    description="A digital twin management system for Apple products and services.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(twin_routes.router, prefix="/api/v1", tags=["Digital Twins"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Apple Digital Twin API", "docs": "/docs"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
