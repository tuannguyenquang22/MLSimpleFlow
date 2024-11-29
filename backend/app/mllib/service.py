from .repository import AVAILABLE_MODEL


def get_hyperparameters(problem_type, model_name):
    try:
        model = AVAILABLE_MODEL[problem_type][model_name]()
        result = model.get_params()
        return result
    except KeyError:
        raise Exception("Invalid problem type or model name.")
    except Exception:
        raise Exception("Failed to get hyperparameters of model.")


def get_models(problem_type):
    return list(AVAILABLE_MODEL[problem_type].keys())