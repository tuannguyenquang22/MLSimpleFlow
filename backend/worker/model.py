from sklearn.ensemble import ExtraTreesClassifier, ExtraTreesRegressor, RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from xgboost import XGBRegressor, XGBClassifier
from sklearn.svm import SVC, SVR


ML_MODEL = {
    "regression": {
        "random_forest": RandomForestRegressor(),
        "knn": KNeighborsRegressor(),
        "extra_tree": ExtraTreesRegressor(),
        "svm": SVR(),
        "xgboost": XGBRegressor(),
        "linear": Ridge(),
    },
    "classification": {
        "random_forest": RandomForestClassifier(),
        "knn": KNeighborsClassifier(),
        "extra_tree": ExtraTreesClassifier(),
        "xgboost": XGBClassifier(),
        "svm": SVC(),
        "linear": LogisticRegression(solver="liblinear"),
    },
}


def get_model(problem_type: str, model_name: str):
    return ML_MODEL[problem_type][model_name]