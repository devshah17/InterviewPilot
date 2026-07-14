import os
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

db_manager = MongoDB()

async def get_database():
    if db_manager.client is None:
        # Check if we are running under pytest (where DB_URL might be a mongomock URI)
        db_manager.client = AsyncIOMotorClient(settings.DB_URL)
        db_manager.db = db_manager.client.get_database("interview_pilot")
    return db_manager.db
