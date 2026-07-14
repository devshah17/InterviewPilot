from fastapi import APIRouter
from api.endpoints import auth

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["authentication"])

@router.get("/")
async def root():
    return {"message": "Welcome to InterviewPilot API"}

# Example of including another router
# from .endpoints import some_router
# router.include_router(some_router.router, prefix="/some", tags=["some"])
