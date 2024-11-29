from fastapi import APIRouter
from . import service
import simplejson as json

router = APIRouter(prefix="/api/v1/mllib", tags=["mllib"])


@router.get("/{problem_type}/{model_name}")
def get_hyperparameters(problem_type: str, model_name: str):
    try:
        response = service.get_hyperparameters(problem_type, model_name)
        json_response = json.dumps({
            "status": 100,
            "message": "Success",
            "data": response
        }, ignore_nan=True)
        return json_response

    except Exception as e:
        return {"status": 200, "message": str(e), "data": None}


@router.get("/")
def get_models():
    try:
        regressions = service.get_models("regression")
        classifications = service.get_models("classification")
        response = {
            "regression": regressions,
            "classification": classifications
        }
        return {"status": 100, "message": "Success", "data": response}

    except Exception as e:
        return {"status": 200, "message": str(e), "data": None}