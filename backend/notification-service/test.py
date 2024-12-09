from kafka import KafkaConsumer

consumer = KafkaConsumer('test', bootstrap_servers='localhost:9092')