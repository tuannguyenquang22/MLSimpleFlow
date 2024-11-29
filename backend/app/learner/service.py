from bson import ObjectId
from app.database import SIMPLEFLOW_DATABASE, CELERY_COLLECTION
from app.learner.model import Learner
from app.learner.schema import LearnerCreate
from worker.tasks import execute_training
import app.featureset.service as featureset_service
import simplejson as json


def create_learner(
    item: LearnerCreate
):
    try:
        learner = Learner(**item.model_dump())
        insert_data = learner.model_dump()
        insert_data["featureset_id"] = ObjectId(insert_data["featureset_id"])
        data = SIMPLEFLOW_DATABASE["learner"].insert_one(insert_data)
        learner.id = str(data.inserted_id)
    except Exception:
        raise Exception("Failed to save learner")
    return learner

def training(
    id: str,
):
    try:
        data =  SIMPLEFLOW_DATABASE["learner"].find_one({"_id": ObjectId(id)})
        data["_id"] = str(data["_id"])
        data["featureset_id"] = str(data["featureset_id"])
        learner = Learner(**data)
    except Exception:
        raise Exception("Failed to get learner")

    try:
        featureset = featureset_service.get_featureset_by_id(learner.featureset_id)
    except Exception:
        raise Exception("Failed to get featureset, please check if the featureset exists")

    bucket_name = "simpleflow"
    object_name = f"featureset/{featureset.id}"
    target_column = featureset.target.column

    celery_task = execute_training.delay(
        learner_id=learner.id,
        bucket_name=bucket_name,
        object_name=object_name,
        target_column=target_column,
        problem_type=learner.problem_type,
        algorithm=learner.algorithm.model_dump(),
        test_size=learner.test_size,
    )

    task_id = str(celery_task.id)
    SIMPLEFLOW_DATABASE["learner"].update_one({"_id": ObjectId(id)}, {"$push": {"tasks": task_id}})

    return {"task_id": task_id}


def get_all_learners():
    try:
        learners = []
        pipeline = [
            {
                "$lookup": {
                    "from": "featureset",
                    "localField": "featureset_id",
                    "foreignField": "_id",
                    "as": "featureset"
                }
            },
        ]
        mapped_learner = SIMPLEFLOW_DATABASE["learner"].aggregate(pipeline)

        for learner in mapped_learner:
            learner["_id"] = str(learner["_id"])
            learner.pop("featureset_id")
            learner["featureset"] = learner["featureset"][0]
            learner["featureset"]["_id"] = str(learner["featureset"]["_id"])
            learner["featureset"].pop("features")
            learner["featureset"].pop("target")
            try:
                learner.pop("best_hyperparameters")
            except Exception:
                pass
            learners.append(learner)
        return learners
    except Exception as e:
        print(e)
        raise Exception("Failed to get learners")


def get_learner_by_id(id: str):
    try:
        mapped_learner = SIMPLEFLOW_DATABASE["learner"].aggregate([
            {
                "$match": {
                    "_id": ObjectId(id)
                }
            },
            {
                "$lookup": {
                    "from": "featureset",
                    "localField": "featureset_id",
                    "foreignField": "_id",
                    "as": "featureset"
                }
            },
        ])

        for learner in mapped_learner:
            learner["_id"] = str(learner["_id"])
            learner.pop("featureset_id")

            learner["featureset"][0]["_id"] = str(learner["featureset"][0]["_id"])
            try:
                learner["best_hyperparameters"] = json.dumps(learner["best_hyperparameters"], ignore_nan=True)
            except Exception:
                pass
            return learner

    except Exception as e:
        print(e)
        raise Exception("Failed to get learner")


def update_learner_by_id(id: str, item: LearnerCreate):
    try:
        data = SIMPLEFLOW_DATABASE["learner"].find_one({"_id": ObjectId(id)})
        if data:
            data.update(item.model_dump())
            SIMPLEFLOW_DATABASE["learner"].update_one({"_id": ObjectId(id)}, {"$set": data})
            return Learner(**data)
        else:
            raise Exception("Learner not found")
    except Exception:
        raise Exception("Failed to update learner")


def delete_learner_by_id(id: str):
    try:
        data = SIMPLEFLOW_DATABASE["learner"].find_one({"_id": ObjectId(id)})
        if data:
            SIMPLEFLOW_DATABASE["learner"].delete_one({"_id": ObjectId(id)})
            return Learner(**data)
        else:
            raise Exception("Learner not found")
    except Exception:
        raise Exception("Failed to delete learner")


def get_task_by_id(id: str):
    try:
        data = SIMPLEFLOW_DATABASE["learner"].find_one({"_id": ObjectId(id)})
        task_ids = data["tasks"]
        celery_tasks = CELERY_COLLECTION.find({"_id": {"$in": task_ids}})
        tasks = []
        for task in celery_tasks:
            task.pop("traceback")
            tasks.append(task)

        sorted_tasks = sorted(tasks, key= lambda x: x.get("date_done", ""), reverse=True)
        return sorted_tasks
    except Exception as e:
        print(e)
        raise Exception("Failed to get task")