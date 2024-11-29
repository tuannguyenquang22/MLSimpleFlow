from celery import Celery


celery_app = Celery(
    "simpleflow_backend",
    broker='redis://simpleflow_redis:6379/0',
    backend='mongodb://root:rootpassword@simpleflow_db:27017/',
    include=['worker.tasks'],
)


celery_app.conf.update(
    result_expires=3600,
)

celery_app.conf.broker_connection_retry_on_startup = True