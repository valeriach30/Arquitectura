import pika
import os
import logging
from dotenv import load_dotenv

load_dotenv("config.env")

logging.basicConfig(level=logging.INFO)

def callback_rabbitmq(ch, method, properties, body):
    logging.info(f"Llego esto de rabbitmq: {body.decode()}")

def start_consuming():
    rabbitmq_host = os.getenv("RABBITMQ_HOST", "localhost")
    connection = pika.BlockingConnection(pika.ConnectionParameters(rabbitmq_host))
    channel = connection.channel()
    channel.queue_declare(queue='cola-de-notificaciones')
    channel.basic_consume(queue='cola-de-notificaciones', on_message_callback=callback_rabbitmq, auto_ack=True)
    logging.info("Esperando mensajes...")
    channel.start_consuming()

if __name__ == "__main__":
    start_consuming()
