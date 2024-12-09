from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class TrainingJob(BaseModel):
    name: str

    dataset_id: str

    user_id: str

    created_at: datetime = Field(default_factory=datetime.now)

    modified_at: datetime = Field(default_factory=datetime.now)

    target: str

    features: Optional[list] = Field(default=None) # None if all features in the dataset

    evaluate_method: str

    algorithm_name: str

    hyperparameters: Optional[dict] = Field(default=None)

    problem_type: str

    # For holdout method
    test_size: float = Field(default=0.2)

    # For cross validation method
    kfolds: int = Field(default=5)

    random_state: int = Field(default=42)

    # For Hyperparameter Tuning
    is_tuning: bool = Field(default=False)

    search_space: Optional[dict] = Field(default=None)

    objective_metric: Optional[str] = Field(default=None)

    num_trails: int = Field(default=10)

    schedule: Optional[str] = Field(default=None)

    # For notification
    observered_metric: Optional[str] = Field(default=None)

    metric_threshold: Optional[float] = Field(default=0)


class TrainingTask(BaseModel):
    job_id: str

    result_id: str
    
    target: str

    features: Optional[list] = Field(default=None)

    evaluate_method: str

    dataset_id: str

    user_id: str

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


class TrainingResult(BaseModel):
    job_id: str

    target: str

    features: Optional[list] = Field(default=None)
    
    evaluate_method: str

    dataset_id: str

    user_id: str

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

    score: Optional[dict] = Field(default=None)

    y_pred: Optional[list] = Field(default=None)

    y_true: Optional[list] = Field(default=None)

    features_importance: Optional[list] = Field(default=None)

    pending_at: datetime = Field(default_factory=datetime.now)

    completed_at: Optional[datetime] = Field(default=None)

    time_cost: Optional[float] = Field(default=None)

    status: str = Field(default="pending")

    tuning_log: Optional[list] = Field(default=None)