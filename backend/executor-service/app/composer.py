import json
import os
import tempfile
import pandas as pd
from ray.tune.schedulers import ASHAScheduler

from sklearn.metrics import (
    r2_score,
    mean_absolute_error,
    root_mean_squared_error,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score
)

from sklearn.linear_model import Ridge, LogisticRegression
from sklearn.ensemble import (
    RandomForestRegressor,
    ExtraTreesRegressor,
    GradientBoostingRegressor,
    RandomForestClassifier,
    ExtraTreesClassifier,
    GradientBoostingClassifier,
)
from sklearn.neighbors import KNeighborsRegressor, KNeighborsClassifier
from sklearn.neural_network import MLPRegressor, MLPClassifier
from sklearn.svm import SVR, SVC

from sklearn.model_selection import train_test_split, KFold, cross_val_score, cross_val_predict
import requests
import pickle
from app.config import settings
from minio import Minio, S3Error
from ray import tune

CHUNK_SIZE = 1024 * 1024 * 10

class Composer:
    _LIB_ALGO = ["linear", "random_forest", "extra_trees", "knn"]

    _LIB_MODEL = {
        "regression": {
            "linear": Ridge(),
            "random_forest": RandomForestRegressor(),
            "extra_trees": ExtraTreesRegressor(),
            "knn": KNeighborsRegressor(),
            "mlp": MLPRegressor(),
            "gradient_boosting": GradientBoostingRegressor(),
            "svm": SVR(),
        },
        "classification": {
            "linear": LogisticRegression(solver="liblinear"),
            "random_forest": RandomForestClassifier(),
            "extra_trees": ExtraTreesClassifier(),
            "knn": KNeighborsClassifier(),
            "mlp": MLPClassifier(),
            "gradient_boosting": GradientBoostingClassifier(),
            "svm": SVC(),
        }
    }

    def __init__(self, task: dict):
        self.task = task

        self.model_name = self.task.get("model_name", None)

        self.model_version = self.task.get("model_version", None)

        self.problem_type = self.task.get("problem_type", None)

        self.evaluate_method = self.task.get("evaluate_method", None)

        self.use_features = self.task.get("use_features", None)

        self.target = self.task.get("target", None)

        self.is_tuning = self.task.get("is_tuning", False)

        self.search_space = self.task.get("search_space", None)

        self.num_trials = self.task.get("num_trials", 10)

        # Default for Holdout Evaluation
        self.test_size = self.task.get("test_size", 0.2)

        # Default for Cross Validation Evaluation
        self.kfold = self.task.get("kfold", 5)

        self.dataset_file_name = None

        self.model = None

        self.score = {}

        self.model_hyperparameters = {}

        self.y_true = None

        self.y_pred = None

        self.features_importance = None

        self.tuning_log = None

    def _initialize_model(self):
        problem_type = self.task.get("problem_type", None)
        algorithm_name = self.task.get("algorithm_name", None)
        hyperparameters = self.task.get("hyperparameters", None)

        if problem_type not in ["regression", "classification"]:
            raise Exception("Could not specify problem type in task.")

        if algorithm_name not in self._LIB_ALGO:
            raise Exception("Could not specify algorithm name in task.")

        model = self._LIB_MODEL[problem_type][algorithm_name]
        if isinstance(hyperparameters, dict):
            model.set_params(**hyperparameters)

        return model

    def _load_dataset(self):
        user_id = self.task.get("user_id", None)
        dataset_id = self.task.get("dataset_id", None)

        try:
            headers = {
                "X-User-ID": user_id,
            }
            response = requests.get(f"http://{settings.DATASET_SERVICE_SERVER}/get/{dataset_id}", headers=headers).json()
            dataset_path = response.get("file_url", None)

        except Exception as e:
            print(f"An error occurred while downloading the file: {e}")
            return None

        try:
            minio_client = Minio(
                endpoint=settings.MINIO_ENDPOINT,
                access_key=settings.MINIO_ACCESS_KEY,
                secret_key=settings.MINIO_SECRET_KEY,
                secure=False
            )

            file_path = f"{dataset_path}"
            response = minio_client.get_object(settings.DATASET_BUCKET, file_path)

            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                while True:
                    data = response.read(CHUNK_SIZE)
                    if not data:
                        break
                    temp_file.write(data)

            response.close()
            response.release_conn()

            print(f"Dataset downloaded to {temp_file.name}")
            return temp_file.name
        except S3Error as e:
            print(f"An error occurred while downloading the file: {e}")
            return None

    def _save_model(self):
        model_file_name = f"{self.model_version}.pkl"
        with open(model_file_name, "wb") as file:
            pickle.dump(self.model, file)

        try:
            minio_client = Minio(
                endpoint=settings.MINIO_ENDPOINT,
                access_key=settings.MINIO_ACCESS_KEY,
                secret_key=settings.MINIO_SECRET_KEY,
                secure=False
            )

            if not minio_client.bucket_exists(settings.MODEL_BUCKET):
                minio_client.make_bucket(settings.MODEL_BUCKET)

            minio_client.fput_object(
                settings.MODEL_BUCKET,
                f"{self.model_name}/{model_file_name}",
                model_file_name
            )

        except S3Error as e:
            print(f"An error occurred while uploading the file: {e}")
        finally:
            os.remove(model_file_name)

    def _remove_dataset(self):
        print(f"Removing dataset file {self.dataset_file_name}")
        os.remove(self.dataset_file_name)

    def train(self):
        if self.use_features is not None:
            df = pd.read_csv(self.dataset_file_name, usecols=self.use_features + [self.target])
        else:
            df = pd.read_csv(self.dataset_file_name)

        X = df.drop(self.target, axis=1)
        y = df[self.target]

        model = self._initialize_model()

        if self.evaluate_method == "holdout":
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=self.test_size, random_state=42)

            model.fit(X_train, y_train)

            y_pred = model.predict(X_test)

            if self.problem_type == "regression":
                self.score = {
                    "r2": float(r2_score(y_test, y_pred)),
                    "mae": float(mean_absolute_error(y_test, y_pred)),
                    "rmse": float(root_mean_squared_error(y_test, y_pred)),
                }

            elif self.problem_type == "classification":
                self.score = {
                    "accuracy": float(accuracy_score(y_test, y_pred)),
                    "precision_weighted": float(precision_score(y_test, y_pred, average="weighted")),
                    "recall_weighted": float(recall_score(y_test, y_pred, average="weighted")),
                    "f1_weighted": float(f1_score(y_test, y_pred, average="weighted")),
                }

            self.y_pred = y_pred
            self.y_true = y_test
            self.model_hyperparameters = self.task.get("hyperparameters", {})
            self.model = model

        elif self.evaluate_method == "cross_validation":
            cv = KFold(n_splits=self.kfold, shuffle=True, random_state=42)

            if self.problem_type == "regression":
                r2_scores = cross_val_score(model, X, y, cv=cv, scoring="r2")
                rmse_scores = cross_val_score(model, X, y, cv=cv, scoring="neg_mean_squared_error")
                mae_scores = cross_val_score(model, X, y, cv=cv, scoring="neg_mean_absolute_error")

                self.score = {
                    "r2_mean": float(r2_scores.mean()),
                    "r2_std": float(r2_scores.std()),
                    "rmse_mean": float(rmse_scores.mean()),
                    "rmse_std": float(rmse_scores.std()),
                    "mae_mean": float(mae_scores.mean()),
                    "mae_std": float(mae_scores.std()),
                }

            elif self.problem_type == "classification":
                accuracy_scores = cross_val_score(model, X, y, cv=cv, scoring="accuracy")
                precision_scores = cross_val_score(model, X, y, cv=cv, scoring="precision")
                recall_scores = cross_val_score(model, X, y, cv=cv, scoring="recall")
                f1_scores = cross_val_score(model, X, y, cv=cv, scoring="f1")

                self.score = {
                    "accuracy_mean": float(accuracy_scores.mean()),
                    "accuracy_std": float(accuracy_scores.std()),
                    "precision_mean": float(precision_scores.mean()),
                    "precision_std": float(precision_scores.std()),
                    "recall_mean": float(recall_scores.mean()),
                    "recall_std": float(recall_scores.std()),
                    "f1_mean": float(f1_scores.mean()),
                    "f1_std": float(f1_scores.std()),
                }

            self.y_true = y
            self.y_pred = cross_val_predict(model, X, y, cv=cv)
            self.model_hyperparameters = self.task.get("hyperparameters", {})

            # Train model
            model.fit(X, y)
            self.model = model

        self.features_importance = [float(value) for value in self.model.feature_importances_]

    def tuning(self):
        if self.use_features is not None:
            df = pd.read_csv(self.dataset_file_name, usecols=self.use_features + [self.target])
        else:
            df = pd.read_csv(self.dataset_file_name)

        X = df.drop(self.target, axis=1)
        y = df[self.target]

        # Using Ray Tune for Hyperparameter Tuning
        if self.evaluate_method == "holdout":
            X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42, test_size=self.test_size)

        elif self.evaluate_method == "cross_validation":
            X_train, X_test, y_train, y_test = X.copy(), X.copy(), y.copy(), y.copy()

        num_trials = self.num_trials
        objective_metric = self.task.get("objective_metric", None)

        # Ray Tune Objective Function
        def objective(config):
            model = self._initialize_model()
            model.set_params(**config)

            # Aim score is maximize
            score = 0

            if self.evaluate_method == "holdout":
                model.fit(X_train, y_train)
                y_pred = model.predict(X_test)

                if self.problem_type == "regression":
                    if objective_metric == "r2":
                        score = r2_score(y_test, y_pred)
                    elif objective_metric == "mae":
                        score = -mean_absolute_error(y_test, y_pred)
                    elif objective_metric == "rmse":
                        score = -root_mean_squared_error(y_test, y_pred)
                elif self.problem_type == "classification":
                    if objective_metric == "accuracy":
                        score = accuracy_score(y_test, y_pred)
                    elif objective_metric == "precision":
                        score = precision_score(y_test, y_pred, average="weighted")
                    elif objective_metric == "recall":
                        score = recall_score(y_test, y_pred, average="weighted")
                    elif objective_metric == "f1":
                        score = f1_score(y_test, y_pred, average="weighted")

            elif self.evaluate_method == "cross_validation":
                cv = KFold(n_splits=self.kfold, shuffle=True, random_state=42)
                if self.problem_type == "regression":
                    if objective_metric == "r2":
                        score = cross_val_score(model, X, y, cv=cv, scoring="r2").mean()
                    elif objective_metric == "mae":
                        score = cross_val_score(model, X, y, cv=cv, scoring="neg_mean_absolute_error").mean()
                    elif objective_metric == "rmse":
                        score = cross_val_score(model, X, y, cv=cv, scoring="neg_mean_squared_error").mean()
                elif self.problem_type == "classification":
                    if objective_metric == "accuracy":
                        score = cross_val_score(model, X, y, cv=cv, scoring="accuracy").mean()
                    elif objective_metric == "precision":
                        score = cross_val_score(model, X, y, cv=cv, scoring="precision").mean()
                    elif objective_metric == "recall":
                        score = cross_val_score(model, X, y, cv=cv, scoring="recall").mean()
                    elif objective_metric == "f1":
                        score = cross_val_score(model, X, y, cv=cv, scoring="f1").mean()

            return {"score": score}

        search_space = {}
        for key, value in self.search_space.items():
            if value.get("type") == "int":
                search_space[key] = tune.randint(value.get("min"), value.get("max"))
            elif value.get("type") == "float":
                search_space[key] = tune.uniform(value.get("min"), value.get("max"))
            elif value.get("type") == "choice":
                search_space[key] = tune.choice(value.get("values"))

        tuner = tune.Tuner(
            objective,
            tune_config=tune.TuneConfig(
                num_samples=num_trials,
                scheduler=ASHAScheduler(metric="score", mode="max"),
            ),
            param_space=search_space,
        )

        results = tuner.fit()
        best_result = results.get_best_result(metric="score", mode="max")

        results_df = results.get_dataframe(filter_metric="score", filter_mode="max")
        results_json = results_df.to_json(orient="records")
        self.tuning_log = json.loads(results_json)

        self.score = {
            "objective_metric": float(best_result.metrics.get("score"))
        }
        self.model_hyperparameters = best_result.config

        best_model = self._initialize_model().set_params(**best_result.config)
        best_model.fit(X_train, y_train)

        self.model = best_model

        if self.evaluate_method == "holdout":
            self.y_pred = best_model.predict(X_test)
            self.y_true = y_test
        elif self.evaluate_method == "cross_validation":
            self.y_pred = cross_val_predict(best_model, X, y, cv=KFold(n_splits=self.kfold, shuffle=True, random_state=42))
            self.y_true = y

        self.features_importance = [float(value) for value in best_model.feature_importances_]

    def run(self):
        self.dataset_file_name = self._load_dataset()
        try:
            if self.is_tuning:
                self.tuning()
            else:
                self.train()

            self._save_model()
        except Exception as e:
            print(f"An error occurred while training the model: {e}")
        finally:
            self._remove_dataset()