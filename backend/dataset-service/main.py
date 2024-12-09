from bson import ObjectId
from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Form
from minio import S3Error

from database import db, serialize_doc
from model import Dataset
import pandas as pd
from schemas import DatasetResponse
from storage import client, BUCKET_NAME
from dependencies import get_user_id
import uuid
import io


app = FastAPI(title="MLSimpleflow Data Service", version="0.1.0")


CHUNK_SIZE = 1024 * 1024 * 10  # 10MB


@app.get("/hello")
def greetings():
    return {"message": "Welcome to MLSimpleflow Data Service!"}


@app.post("/upload", response_model=DatasetResponse)
async def upload_dataset(
    name: str = Form(...),
    description: str = Form(default=""),
    file: UploadFile = File(...),
    user_id: str = Depends(get_user_id)
):
    file_extension = file.filename.split(".")[-1]

    # Only allow CSV files
    if file_extension != "csv":
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    object_name = f"{user_id}/{unique_filename}"

    try:
        data: bytes = await upload_file_to_minio(file, object_name)

        df = pd.read_csv(io.BytesIO(data))

        rows = df.shape[0]
        cols = df.shape[1]

        col_names = df.columns.tolist()
        col_types = [str(df[col].dtype) for col in col_names]

        dataset = Dataset(
            user_id=user_id,
            name=name,
            description=description,
            file_url=object_name,
            rows=rows,
            cols=cols,
            col_names=col_names,
            col_types=col_types,
        )

        result = await db.dataset.insert_one(dataset.model_dump())
        return DatasetResponse(**dataset.model_dump(), id=str(result.inserted_id))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/get/{dataset_id}", response_model=DatasetResponse)
async def get_dataset(dataset_id: str, user_id: str = Depends(get_user_id)):
    dataset = await db.dataset.find_one({"_id": ObjectId(dataset_id), "user_id": user_id})
    if dataset:
        return DatasetResponse(**dataset, id=str(dataset['_id']))
    else:
        raise HTTPException(status_code=404, detail="Dataset not found")
    

@app.get("/get/{dataset_id}/url")
async def get_url_dataset(dataset_id: str, user_id: str = Depends(get_user_id)):
    dataset = await db.dataset.find_one({"_id": ObjectId(dataset_id), "user_id": user_id})
    if dataset:
        object_name = dataset['file_url'].split(f'/{BUCKET_NAME}/')[-1]
        url = client.presigned_get_object(BUCKET_NAME, object_name)
        return url
    else:
        raise HTTPException(status_code=404, detail="Dataset not found")


@app.get("/all", response_model=list[DatasetResponse])
async def list_datasets(user_id: str = Depends(get_user_id)):
    datasets = []
    async for doc in db.dataset.find({"user_id": user_id}):
        datasets.append(DatasetResponse(**serialize_doc(doc)))
    return datasets


@app.delete("/delete/{dataset_id}", response_model=dict)
async def delete_dataset(dataset_id: str, user_id: str = Depends(get_user_id)):
    dataset = await db.dataset.find_one({"_id": ObjectId(dataset_id), "user_id": user_id})
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found or access denied")
    # Delete the file from MinIO
    object_name = dataset['file_url'].split(f'/{BUCKET_NAME}/')[-1]
    try:
        client.remove_object(BUCKET_NAME, object_name)
    except S3Error as e:
        raise HTTPException(status_code=500, detail=f"MinIO deletion failed: {e}")
    # Delete metadata from MongoDB
    await db.datasets.delete_one({"_id": ObjectId(dataset_id)})
    return {"detail": "Dataset deleted successfully"}


async def upload_file_to_minio(file: UploadFile, object_name: str):
    try:
        await file.seek(0)
        data = await file.read()
        client.put_object(
            BUCKET_NAME,
            object_name,
            io.BytesIO(data),
            length=len(data),
            content_type=file.content_type
        )

        # Return data for extract metadata by pandas
        return data
    
    except S3Error as e:
        raise HTTPException(status_code=500, detail=f"MinIO upload failed: {e}")
    finally:
        await file.close()