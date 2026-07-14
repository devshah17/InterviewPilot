from fastapi import APIRouter, HTTPException, status, Depends, Response, Request
from models.user import UserCreate, UserLogin, UserResponse, UserInDB
from core.security import get_password_hash, verify_password, create_access_token, verify_access_token
from db.mongodb import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone
import uuid

router = APIRouter()

async def get_current_user(request: Request, db: AsyncIOMotorDatabase = Depends(get_database)) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
        
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
        
    user = await db["users"].find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    return user

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, response: Response, db: AsyncIOMotorDatabase = Depends(get_database)):
    # Check if user already exists
    existing_user = await db["users"].find_one({"email": user_in.email})
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
        
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user_in.password)
    
    user_dict = {
        "_id": user_id,
        "email": user_in.email,
        "name": user_in.name,
        "hashed_password": hashed_password,
        "role": "user",
        "created_at": datetime.now(timezone.utc)
    }
    
    await db["users"].insert_one(user_dict)
    
    # Generate token
    token = create_access_token(data={"sub": user_id, "email": user_in.email})
    
    # Set HttpOnly cookie
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=60*24*7*60 # 7 days
    )
    
    user_dict["id"] = user_dict["_id"]
    return user_dict

@router.post("/login", response_model=UserResponse)
async def login(user_in: UserLogin, response: Response, db: AsyncIOMotorDatabase = Depends(get_database)):
    user = await db["users"].find_one({"email": user_in.email})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
        
    if not verify_password(user_in.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
        
    # Generate token
    token = create_access_token(data={"sub": user["_id"], "email": user["email"]})
    
    # Set HttpOnly cookie
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=60*24*7*60 # 7 days
    )
    
    user["id"] = user["_id"]
    return user

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token", secure=True, httponly=True, samesite="lax")
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    current_user["id"] = current_user["_id"]
    return current_user
