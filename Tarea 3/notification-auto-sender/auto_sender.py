import pika
import os
import time
from dotenv import load_dotenv
import logging

load_dotenv("config.env")
logging.basicConfig(level=logging.INFO)

rabbitmq_host = os.getenv("RABBITMQ_HOST", "localhost")

def send_notification(user, notification):
    connection = pika.BlockingConnection(pika.ConnectionParameters(rabbitmq_host))
    channel = connection.channel()
    channel.queue_declare(queue='cola-de-notificaciones')

    data = {
        "user": user,
        "notification": notification
    }
    channel.basic_publish(exchange='', routing_key='cola-de-notificaciones', body=str(data))
    logging.info(f"Mensaje enviado: {data}")

    connection.close()

if __name__ == "__main__":
    counter = 1
    while True:
        send_notification(f"user_{counter}", f"Notificación automática #{counter}")
        counter += 1
        time.sleep(5)
