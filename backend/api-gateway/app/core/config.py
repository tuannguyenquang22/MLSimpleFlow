from typing import Any

import os
from pydantic_settings import BaseSettings
import secrets
from dotenv import load_dotenv


load_dotenv()


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_SECONDS: int = 60 * 30
    REFRESH_TOKEN_EXPIRE_SECONDS: int = 60 * 30 * 24 * 30
    JWT_ALGO: str = "HS512"
    TOTP_ALGO: str = "SHA-1"

    ALLOWED_HOSTS: str = os.getenv("ALLOWED_HOSTS")

    MONGO_DATABASE: str = os.getenv("MONGO_DATABASE")
    MONGO_DATABASE_URI: str = os.getenv("MONGO_DATABASE_URI")

    DATASET_SERVICE_SERVER: str = os.getenv("DATASET_SERVICE_SERVER")
    TRAINING_SERVICE_SERVER: str = os.getenv("TRAINING_SERVICE_SERVER")

    MULTI_MAX: int = 20


settings = Settings()
