from minio import Minio
from config import settings


client = Minio(
    endpoint=settings.MINIO_ENDPOINT,
    access_key=settings.MINIO_ACCESS_KEY,
    secret_key=settings.MINIO_SECRET_KEY,
    secure=False
)


BUCKET_NAME = settings.BUCKET_NAME
found = client.bucket_exists(BUCKET_NAME)

if not found:
    client.make_bucket(BUCKET_NAME)
    print(f"Bucket '{BUCKET_NAME}' created.")
else:
    print(f"Bucket '{BUCKET_NAME}' already exists.")