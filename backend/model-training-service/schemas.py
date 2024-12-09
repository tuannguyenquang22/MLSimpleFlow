# Import library
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional
from models import TrainingResult


class TrainingJobCreate(BaseModel):
    name: str

    dataset_id: str

    target: str

    evaluate_method: str

    algorithm_name: str

    hyperparameters: Optional[dict] = Field(default=None)

    problem_type: str

    test_size: float = Field(default=0.2)

    kfolds: int = Field(default=5)

    random_state: int = Field(default=42)

    is_tuning: bool = Field(default=False)
    
    search_space: Optional[dict] = Field(default=None)

    objective_metric: Optional[str] = Field(default=None)

    num_trails: int = Field(default=10)

    schedule: Optional[str] = Field(default=None)

    observered_metric: Optional[str] = Field(default=None)

    metric_threshold: Optional[float] = Field(default=0)


class TrainingJobUpdate(BaseModel):
    name: str

    target: str

    evaluate_method: str

    algorithm_name: str

    hyperparameters: Optional[dict] = Field(default=None)

    problem_type: str

    test_size: float = Field(default=0.2)

    kfolds: int = Field(default=5)

    random_state: int = Field(default=42)

    is_tuning: bool = Field(default=False)

    search_space: Optional[dict] = Field(default=None)

    objective_metric: Optional[str] = Field(default=None)

    num_trails: int = Field(default=10)

    schedule: Optional[str] = Field(default=None)

    observered_metric: Optional[str] = Field(default=None)

    metric_threshold: Optional[float] = Field(default=0)


class TrainingJobResponse(BaseModel):
    id: str

    name: str

    dataset_id: str

    created_at: datetime

    modified_at: datetime

    target: str

    evaluate_method: str

    algorithm_name: str

    problem_type: str

    test_size: float = Field(default=0.2)

    kfolds: int = Field(default=5)

    random_state: int = Field(default=42)

    # For Hyperparameter Tuning
    is_tuning: bool = Field(default=False)

    search_space: Optional[dict] = Field(default=None)

    objective_metric: Optional[str] = Field(default=None)

    num_trails: int = Field(default=10)

    schedule: Optional[str] = Field(default=None)

    observered_metric: Optional[str] = Field(default=None)

    metric_threshold: Optional[float] = Field(default=None)


class TrainingResultUpdate(BaseModel):
    status: str

    score: Optional[dict] = Field(default=None)

    y_pred: Optional[list] = Field(default=None)

    y_true: Optional[list] = Field(default=None)

    hyperparameters: Optional[dict] = Field(default=None)

    time_cost: Optional[float] = Field(default=None)

    features_importance: Optional[list] = Field(default=None)

    tuning_log: Optional[list] = Field(default=None)

    completed_at: Optional[datetime] = Field(default_factory=datetime.now)

class TrainingResultResponse(TrainingResult):
    id: str