from kafka import KafkaConsumer
import threading
import app.composer
import json
import requests
import time
from datetime import datetime
from app.config import settings


def listen_execute_topic():
    consumer = KafkaConsumer(
        settings.EXECUTE_TOPIC,
        bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVER,
        value_deserializer=lambda m: json.loads(m.decode("utf-8"))
    )
    for message in consumer:
        task = message.value
        execute_task(task)


def execute_task(request: dict):
    # Notifiy the client that the task is being executed
    print(f"Task {request.get('result_id', '')} is being executed soon ...")
    start_time = time.time()
    time.sleep(5)

    try:
        headers = {
            "X-User-ID": request.get("user_id", "")
        }
        body = {
            "status": "running",
        }
        requests.post(f"http://{settings.TRAINING_SERVICE_SERVER}/result/{request.get('result_id', '')}", headers=headers, json=body)
    except Exception as e:
        print(f"Error when notify the client: {e}")

    task = {
        "model_name": request.get("job_id", None),

        "model_version": request.get("result_id", None),

        "problem_type": request.get("problem_type", None),

        "user_id": request.get("user_id", None),

        "dataset_id": request.get("dataset_id", None),

        "use_features": request.get("features", None),

        "target": request.get("target", None),

        "algorithm_name": request.get("algorithm_name", None),

        "hyperparameters": request.get("hyperparameters", None),

        "evaluate_method": request.get("evaluate_method", None),

        "test_size": request.get("test_size", 0.2),

        "kfold": request.get("kfold", 5),

        "random_state": request.get("random_state", 42),

        "is_tuning": request.get("is_tuning", False),

        "search_space": request.get("search_space", {}),

        "objective_metric": request.get("objective_metric", ""),

        "num_trials": request.get("num_trials", 10)
    }

    execute_composer = app.composer.Composer(task=task)
    try:
        execute_composer.run()
        score = execute_composer.score
        model_hyperparameters = execute_composer.model_hyperparameters
        y_pred = execute_composer.y_pred
        y_true = execute_composer.y_true
        features_importance = execute_composer.features_importance

        # Wait about 5 seconds to simulate the training process
        time.sleep(5)
        end_time = time.time()
        # Update the result to the database
        try:
            headers = {
                "X-User-ID": request.get("user_id", "")
            }
            body = {
                "status": "completed",
                "score": score,
                "model_hyperparameters": model_hyperparameters,
                "y_pred": y_pred.tolist(),
                "y_true": y_true.tolist(),
                "features_importance": features_importance,
                "completed_at": datetime.now().isoformat(),
                "time_cost": end_time - start_time,
                "tuning_log": execute_composer.tuning_log
            }
            requests.post(f"http://{settings.TRAINING_SERVICE_SERVER}/result/{request.get('result_id', '')}", headers=headers, json=body)
            print(f"Task {request.get('result_id', '')} is completed")

        except Exception as e:
            print(f"Error when notify the client: {e}")
    except Exception as e:
        headers = {
            "X-User-ID": request.get("user_id", "")
        }
        failed_body = {
            "status": "failed",
            "completed_at": datetime.now().isoformat(),
            "time_cost": time.time() - start_time
        }
        requests.post(f"http://{settings.TRAINING_SERVICE_SERVER}/result/{request.get('result_id', '')}", headers=headers, json=failed_body)
        print(f"Error when execute task: {e}")


if __name__ == "__main__":
    print("---------- Training Executor Service ----------")
    listen_thread = threading.Thread(target=listen_execute_topic)
    listen_thread.start()
