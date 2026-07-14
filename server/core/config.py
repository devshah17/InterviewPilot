from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "InterviewPilot API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # DB Settings
    DB_URL: str
    
    # JWT Settings
    SECRET_KEY: str = "super_secret_temporary_key_replace_in_prod"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
