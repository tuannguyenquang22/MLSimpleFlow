import os
import threading

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from dotenv import load_dotenv
from kafka import KafkaProducer, KafkaConsumer
import json


load_dotenv()


KAFKA_BOOTSTRAP_SERVER = os.getenv("KAFKA_BOOTSTRAP_SERVER")
EXECUTE_TOPIC = os.getenv("EXECUTE_TOPIC")
SCHEDULE_TOPIC = os.getenv("SCHEDULE_TOPIC")


producer = KafkaProducer(
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVER,
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)


scheduler = BackgroundScheduler()
scheduler.start()


def parse_cron_expression(cron_expression):
    parts = cron_expression.strip().split()
    second = minute = hour = day = month = day_of_week = year = None

    if len(parts) == 5:
        # Cron expression không có trường giây
        minute, hour, day, month, day_of_week = parts
        second = '0'  # Mặc định giây là 0
    elif len(parts) == 6:
        # Cron expression có trường giây
        second, minute, hour, day, month, day_of_week = parts

    elif len(parts) == 7:
        # Cron expression có trường giây và trường năm
        second, minute, hour, day, month, day_of_week, year = parts
    else:
        raise ValueError("Invalid cron expression")

    return second, minute, hour, day, month, day_of_week, year


def send_task(data):
    producer.send(EXECUTE_TOPIC, data)
    producer.flush()


def schedule_task(task):
    schedule = task.get("schedule")
    is_run_now = task.get("is_run_now")
    try:
        second, minute, hour, day, month, day_of_week, year = parse_cron_expression(schedule)
        trigger = CronTrigger(
            second=second,
            minute=minute,
            hour=hour,
            day=day,
            month=month,
            day_of_week=day_of_week,
            year=year
        )

        scheduler.add_job(send_task, trigger=trigger, args=[task], id=task.get("job_id"))
        print(f"[INFO] Task '{task.get('job_id')}' is scheduled")

    except Exception:
        print("This task cannot be scheduled")
        # Check if scheduler has this job with this job_id
        if scheduler.get_job(task.get("job_id")):
            scheduler.remove_job(task.get("job_id"))
            print(f"[INFO] Task '{task.get('job_id')}' is removed from scheduler")

    if is_run_now:
        send_task(task)
        print(f"[INFO] Task '{task.get('job_id')}' is executed")
    else:
        print(f"[INFO] Nothing to do now.")


def listen_schedule_topic():
    print("[INFO] Start listening 'schedule-topic' ...")
    consumer = KafkaConsumer(
        SCHEDULE_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVER,
        value_deserializer=lambda m: json.loads(m.decode("utf-8"))
    )

    print("[INFO] Waiting from producer ...")
    for messsage in consumer:
        task = messsage.value
        schedule_task(task)


if __name__ == "__main__":
    print("---------- Training Schedule Service ----------")
    listen_thread = threading.Thread(target=listen_schedule_topic)
    listen_thread.start()