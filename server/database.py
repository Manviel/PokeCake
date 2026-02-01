import os
from pathlib import Path

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# Load .env from root directory
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# If MONGODB_URL is provided (e.g. from Docker), use it.
# Otherwise, construct it from credentials (assuming localhost for local dev).
username = os.getenv("MONGODB_USERNAME")
password = os.getenv("MONGODB_PASSWORD")
host = os.getenv("MONGODB_HOST", "localhost")
DATABASE_NAME = os.getenv("DATABASE_NAME") or os.getenv("MONGODB_DATABASE")

if not (username and password and DATABASE_NAME):
    raise ValueError(
        "Missing MongoDB configuration. Please set (MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_DATABASE) in your .env file."
    )

MONGODB_URL = f"mongodb://{username}:{password}@{host}:27017/{DATABASE_NAME}?authSource={DATABASE_NAME}"

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]


async def get_database():
    return db
