db = db.getSiblingDB('mlsimpleflow_gateway');
db.createCollection('user');
db.createCollection('token');


db = db.getSiblingDB('mlsimpleflow_dataset');
db.createCollection('dataset');


db = db.getSiblingDB('mlsimpleflow_model');
db.createCollection('training');
db.createCollection('result');