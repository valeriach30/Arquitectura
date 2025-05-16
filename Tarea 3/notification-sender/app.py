from flask import Flask, jsonify, request
from flasgger import Swagger, swag_from
import pika
from dotenv import load_dotenv
import os

app = Flask(__name__)
swagger = Swagger(app)

load_dotenv("config.env")


@app.route('/rabbitmq', methods=['POST'])
@swag_from({
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'usuario': {'type': 'string'},
                    'notificacion': {'type': 'string'}
                },
                'required': ['usuario', 'notificacion']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Mensaje enviado'
        }
    }
})
def rabbitmq():
    """
    Enviar notificación personalizada a RabbitMQ
    ---
    tags:
      - RabbitMQ
    """
    content = request.get_json()

    rabbitmq_host = os.getenv("RABBITMQ_HOST")

    connection = pika.BlockingConnection(
        pika.ConnectionParameters(rabbitmq_host))
    channel = connection.channel()
    channel.queue_declare(queue='cola-de-notificaciones')

    channel.basic_publish(
        exchange='',
        routing_key='cola-de-notificaciones',
        body=str(content)
    )
    connection.close()

    return jsonify({"mensaje": "Notificación enviada a RabbitMQ", "data": content}), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
