import os
from dotenv import load_dotenv


load_dotenv()


class Settings:
    MONGO_DATABASE_URI: str = os.getenv("MONGO_DATABASE_URI")
    MONGO_DATABASE: str = os.getenv("MONGO_DATABASE")

    MINIO_ENDPOINT: str = os.getenv("MINIO_ENDPOINT")
    MINIO_ACCESS_KEY: str = os.getenv("MINIO_ACCESS_KEY")
    MINIO_SECRET_KEY: str = os.getenv("MINIO_SECRET_KEY")

    BUCKET_NAME: str = os.getenv("BUCKET_NAME")


settings = Settings()
