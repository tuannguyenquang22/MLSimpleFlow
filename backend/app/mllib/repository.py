from sklearn.ensemble import RandomForestRegressor, ExtraTreesRegressor, StackingRegressor, RandomForestClassifier, \
    ExtraTreesClassifier, StackingClassifier
from sklearn.linear_model import Ridge, LogisticRegression
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from xgboost import XGBRegressor, XGBClassifier

AVAILABLE_MODEL = {
    "regression": {
        "linear": Ridge,
        "random_forest": RandomForestRegressor,
        "xgboost": XGBRegressor,
        "extra_tree": ExtraTreesRegressor,
        "knn": KNeighborsRegressor,
        "stacking": StackingRegressor,
    },
    "classification": {
        "linear": LogisticRegression,
        "random_forest": RandomForestClassifier,
        "xgboost": XGBClassifier,
        "extra_tree": ExtraTreesClassifier,
        "knn": KNeighborsClassifier,
        "stacking": StackingClassifier,
    }
}

