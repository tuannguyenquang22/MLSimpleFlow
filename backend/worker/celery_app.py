from celery import Celery


celery_app = Celery(
    "simpleflow_backend",
    broker='redis://localhost:9530/0',
    backend='mongodb://root:rootpassword@localhost:9510/',
    include=['worker.tasks'],
)


celery_app.conf.update(
    result_expires=3600,
)

celery_app.conf.broker_connection_retry_on_startup = True