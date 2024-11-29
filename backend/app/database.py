from minio import Minio
from pymongo import MongoClient

MONGO_CLIENT = MongoClient("mongodb://root:rootpassword@simpleflow_db:27017")
SIMPLEFLOW_DATABASE = MONGO_CLIENT["simpleflow"]
CELERY_COLLECTION = MONGO_CLIENT["celery"]["celery_taskmeta"]

MINIO_CLIENT = Minio(
    endpoint="simpleflow_storage:9000",
    access_key="root",
    secret_key="rootpassword",
    secure=False,
)