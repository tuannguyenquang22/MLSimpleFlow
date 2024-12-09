import os
from dotenv import load_dotenv


load_dotenv()


class Settings:
    KAFKA_BOOTSTRAP_SERVER = os.getenv("KAFKA_BOOTSTRAP_SERVER")
    SCHEDULE_TOPIC = os.getenv("SCHEDULE_TOPIC")
    MONGO_DATABASE_URI = os.getenv("MONGO_DATABASE_URI")
    MONGO_DATABASE = os.getenv("MONGO_DATABASE")


settings = Settings()