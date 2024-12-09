from datetime import datetime

from bson import ObjectId
from fastapi import FastAPI, HTTPException, Depends
from kafka import KafkaProducer
from models import TrainingJob, TrainingResult, TrainingTask
from schemas import TrainingJobCreate, TrainingJobResponse, TrainingResultUpdate, TrainingJobUpdate, \
    TrainingResultResponse
from database import db
from dependencies import get_user_id

# ML Model
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingClassifier, GradientBoostingRegressor, ExtraTreesClassifier, ExtraTreesRegressor
from sklearn.svm import SVC, SVR
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.neural_network import MLPClassifier, MLPRegressor

import json
from config import settings


producer = KafkaProducer(
    bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVER,
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)


app = FastAPI()


@app.get("/algorithms")
async def get_algorithms(user_id = Depends(get_user_id)):
    """
    Get all available algorithms
    """
    return {
        "algorithms": {
            "regression": [
                {
                    "id": "linear",
                    "name": "Linear (Ridge)",
                    "hyperparameters": list(Ridge().get_params().keys()),
                    "url": "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html"
                },
                {
                    "id": "random_forest",
                    "name": "Random Forest",
                    "hyperparameters": list(RandomForestRegressor().get_params().keys()),
                    "url": "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html"
                },
                {
                    "id": "gradient_boosting",
                    "name": "Gradient Boosting",
                    "hyperparameters": list(GradientBoostingRegressor().get_params().keys()),
                    "url": "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.GradientBoostingRegressor.html"
                },
                {
                    "id": "extra_trees",
                    "name": "Extra Trees",
                    "hyperparameters": list(ExtraTreesRegressor().get_params().keys()),
                    "url": "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.ExtraTreesRegressor.html"
                },
                {
                    "id": "svm",
                    "name": "Support Vector Machine",
                    "hyperparameters": list(SVR().get_params().keys()),
                    "url": "https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVR.html"
                },
                {
                    "id": "knn",
                    "name": "K-Nearest Neighbors",
                    "hyperparameters": list(KNeighborsRegressor().get_params().keys()),
                    "url": "https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsRegressor.html"
                },
                {
                    "id": "mlp",
                    "name": "Multi-layer Perceptron",
                    "hyperparameters": list(MLPRegressor().get_params().keys()),
                    "url": "https://scikit-learn.org/stable/modules/generated/sklearn.neural_network.MLPRegressor.html"
                },
            ],
            "classification": [
                {
                    "id": "linear",
                    "name": "Linear (Logistic)",
                    "hyperparameters": list(LogisticRegression().get_params().keys()),
                    "url": "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html"
                },
                {
                    "id": "random_forest",
                    "name": "Random Forest",
                    "hyperparameters": list(RandomForestClassifier().get_params().keys()),
                    "url": "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html"
                },
                {
                    "id": "gradient_boosting",
                    "name": "Gradient Boosting",
                    "hyperparameters": list(GradientBoostingClassifier().get_params().keys()),
                    "url": "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.GradientBoostingClassifier.html"
                },
                {
                    "id": "extra_trees",
                    "name": "Extra Trees",
                    "hyperparameters": list(ExtraTreesClassifier().get_params().keys()),
                    "url": "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.ExtraTreesClassifier.html"
                },
                {
                    "id": "svm",
                    "name": "Support Vector Machine",
                    "hyperparameters": list(SVC().get_params().keys()),
                    "url": "https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html"
                },
                {
                    "id": "knn",
                    "name": "K-Nearest Neighbors",
                    "hyperparameters": list(KNeighborsClassifier().get_params().keys()),
                    "url": "https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsClassifier.html"
                },
                {
                    "id": "mlp",
                    "name": "Multi-layer Perceptron",
                    "hyperparameters": list(MLPClassifier().get_params().keys()),
                    "url": "https://scikit-learn.org/stable/modules/generated/sklearn.neural_network.MLPClassifier.html"
                },
            ]
        }
    }


@app.post("/create")
async def create_training_job(item: TrainingJobCreate, user_id = Depends(get_user_id)):
    """
    Create a training job
    """
    try:
        job = TrainingJob(**item.model_dump(), user_id=user_id)
        result = await db.training.insert_one(job.model_dump())
        inserted_id = str(result.inserted_id)
        response = TrainingJobResponse(**job.model_dump(), id=str(inserted_id))
        return response
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))


@app.post("/update/{job_id}")
async def update_training_job(job_id: str, item: TrainingJobUpdate, user_id = Depends(get_user_id)):
    """
    Update a training job
    """
    try:
        job_data = await db.training.find_one({"_id": ObjectId(job_id), "user_id": user_id})
        if not job_data:
            raise HTTPException(status_code=404, detail="Training job not found")

        job = TrainingJob(**job_data)

        updated_fields = item.model_dump(exclude_unset=True)
        for field, value in updated_fields.items():
            setattr(job, field, value)

        job.modified_at = datetime.now()
        # Cập nhật vào cơ sở dữ liệu
        await db.training.update_one(
            {"_id": ObjectId(job_id), "user_id": user_id},
            {"$set": job.model_dump()}
        )

        return {"message": "Training job updated successfully"}
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))

    

@app.get("/get/{job_id}")
async def get_training_job(job_id: str, user_id = Depends(get_user_id)):
    """
    Get a training job
    """
    try:
        job = await db.training.find_one({"_id": ObjectId(job_id), "user_id": user_id})
        if job:
            return TrainingJobResponse(**job, id=str(job["_id"]))
        else:
            return HTTPException(status_code=404, detail="Job not found")
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))
    

@app.get("/all")
async def get_all_training_jobs(user_id = Depends(get_user_id)):
    """
    Get all training jobs
    """
    try:
        jobs = []
        async for job in db.training.find({"user_id": user_id}):
            jobs.append(TrainingJobResponse(**job, id=str(job["_id"])))
        return jobs
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))
    

@app.post("/execute/{job_id}")
async def execute_training_job(job_id: str, user_id = Depends(get_user_id)):
    """
    Execute a training job
    """
    try:
        job = await db.training.find_one({"_id": ObjectId(job_id), "user_id": user_id})
        result = TrainingResult(**job, job_id=job_id)
        new_result = await db.result.insert_one(result.model_dump())
        task = TrainingTask(result_id=str(new_result.inserted_id), **job, job_id=job_id)
        task_data = task.model_dump()
        task_data["is_run_now"] = True
        if task:
            producer.send(settings.SCHEDULE_TOPIC, task_data)
            return {"message": "Job executed"}
        else:
            return HTTPException(status_code=404, detail="Job not found")
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))
    

@app.get("/result/{job_id}")
async def get_training_result(job_id: str, user_id = Depends(get_user_id)):
    """
    Get a training results
    """
    try:
        results = await db.result.find({"job_id": job_id, "user_id": user_id}).to_list(length=None)
        if results:
            return [{
                "id": str(result["_id"]),
                "status": result["status"],
                "is_tuning": result["is_tuning"],
                "objective_metric": result["objective_metric"],
                "completed_at": result["completed_at"],
                "score": result["score"],
            } for result in results]
        else:
            return HTTPException(status_code=404, detail="Result not found")
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))


@app.get("/result/id/{result_id}")
async def get_result(result_id: str, user_id = Depends(get_user_id)):
    """
    Get a training result
    """
    try:
        result = await db.result.find_one({"_id": ObjectId(result_id), "user_id": user_id})
        if result:
            return TrainingResultResponse(**result, id=str(result["_id"]))
        else:
            return HTTPException(status_code=404, detail="Result not found")
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))
    

@app.post("/result/{result_id}")
async def update_result(result_id: str, item: TrainingResultUpdate, user_id = Depends(get_user_id), ):
    """
    Update a training result
    """
    try:
        result = await db.result.find_one({"_id": ObjectId(result_id), "user_id": user_id})
        
        result = TrainingResult(**result)
        result.status = item.status
        result.y_pred = item.y_pred if item.y_pred else result.y_pred
        result.score = item.score if item.score else result.score
        result.y_true = item.y_true if item.y_true else result.y_true
        result.hyperparameters = item.hyperparameters if item.hyperparameters else result.hyperparameters
        result.time_cost = item.time_cost if item.time_cost else result.time_cost
        result.features_importance = item.features_importance if item.features_importance else result.features_importance
        result.completed_at = item.completed_at if item.completed_at else result.completed_at
        result.tuning_log = item.tuning_log if item.tuning_log else result.tuning_log
        
        if result:
            await db.result.update_one({"_id": ObjectId(result_id)}, {"$set": result.model_dump()})
            return {"message": "Result updated"}
        else:
            return HTTPException(status_code=404, detail="Result not found")
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))