import os
from dotenv import load_dotenv


load_dotenv()


class Settings:
    KAFKA_BOOTSTRAP_SERVER: str = os.getenv("KAFKA_BOOTSTRAP_SERVER")
    EXECUTE_TOPIC: str = os.getenv("EXECUTE_TOPIC")

    TRAINING_SERVICE_SERVER: str = os.getenv("TRAINING_SERVICE_SERVER")
    DATASET_SERVICE_SERVER: str = os.getenv("DATASET_SERVICE_SERVER")

    MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT")
    MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY")
    MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY")
    DATASET_BUCKET = os.getenv("DATASET_BUCKET")
    MODEL_BUCKET = os.getenv("MODEL_BUCKET")


settings = Settings()
