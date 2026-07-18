from fastapi import APIRouter, Depends, HTTPException, status
from models.topic import TopicCreate, TopicInDB
from models.user import UserInDB
from api.endpoints.auth import get_current_user
from db.mongodb import get_database
from bson import ObjectId
from typing import List

router = APIRouter()

@router.post("/", response_model=TopicInDB, status_code=status.HTTP_201_CREATED)
async def create_topic(topic: TopicCreate, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    topic_dict = topic.model_dump()
    topic_dict["user_id"] = str(current_user["_id"])
    topic_dict["created_at"] = topic_dict.get("created_at") or __import__("datetime").datetime.utcnow()
    
    result = await db["topics"].insert_one(topic_dict)
    topic_dict["_id"] = result.inserted_id
    
    return TopicInDB(**topic_dict)

@router.get("/", response_model=List[TopicInDB])
async def get_topics(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    topics = []
    cursor = db["topics"].find({"user_id": str(current_user["_id"])}).sort("created_at", -1)
    async for document in cursor:
        topics.append(TopicInDB(**document))
    return topics

@router.delete("/{topic_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_topic(topic_id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(topic_id):
        raise HTTPException(status_code=400, detail="Invalid topic ID format")
        
    db = await get_database()
    result = await db["topics"].delete_one({"_id": ObjectId(topic_id), "user_id": str(current_user["_id"])})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Topic not found or you don't have permission to delete it")
