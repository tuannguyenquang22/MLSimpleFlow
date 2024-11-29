FROM python:3.10.15-bullseye

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --no-cache-dir --upgrade pip

RUN pip install -r requirements.txt

COPY . /app/

EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
