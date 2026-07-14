from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(min_length=8, description="Password must be at least 8 characters long")
    name: str = Field(..., min_length=2)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserInDB(UserBase):
    id: str = Field(alias="_id")
    name: str
    hashed_password: str
    created_at: datetime
    role: str = "user"
    
    class Config:
        populate_by_name = True

class UserResponse(UserBase):
    id: str
    name: str
    role: str
    created_at: datetime
    
    class Config:
        populate_by_name = True
