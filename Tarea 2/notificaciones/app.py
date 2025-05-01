import json
import os
from flask import Flask, jsonify, request
from marshmallow import Schema, fields, ValidationError
from flasgger import Swagger
import logging

DATA_FILE = "notifications.json"

# ---------------------------- Flask App ---------------------------

app = Flask(__name__)
swagger = Swagger(app, template={
    "info": {
        "title": "Notifications API",
        "version": "1.0",
        "description": "This is a simple API to manage notifications with JSON file persistence.",
    }
})

# ---------------------------- Logging ----------------------------

logging.basicConfig(level=logging.INFO)

#  ---------------------------- Schema ----------------------------
class NotificationsSchema(Schema):
    users = fields.List(fields.Dict(), required=True)
    type = fields.String(required=True)
    content = fields.String(required=True)
    status = fields.String(required=True)

notifications_schema = NotificationsSchema()

#  ------------------------ File Helpers --------------------------

def load_notifications():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as fileVar:
        return json.load(fileVar)

def save_notifications(notifications):
    with open(DATA_FILE, "w") as fileVar:
        json.dump(notifications, fileVar, indent=2)

def find_notification(notification_id):
    notifications = load_notifications()
    return next((notification for notification in notifications if notification["id"] == notification_id), None)

# ----------------------------- Routes ----------------------------

# >>>>>>>>>>>>>> Get all notifications <<<<<<<<<<<<

@app.route('/notifications', methods=['GET'])
def get_notifications():
    """Get all notifications
    ---
    responses:
      200:
        description: List of notifications
    """
    notifications = load_notifications()
    app.logger.info(
        "Returning list of notifications with length: %d", len(notifications))
    return jsonify(notifications), 200

# >>>>>>>>>>>>>> Get notification by ID <<<<<<<<<<<<

@app.route('/notifications/<int:notification_id>', methods=['GET'])
def get_notification(notification_id):
    """
    Get notification by ID
    ---
    parameters:
      - name: notification_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Notification found
        schema:
          id: notification
          properties:
            id:
              type: integer
            users:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
            type:
              type: string
            content:
              type: string
            status:
              type: string
      404:
        description: Notification not found
        schema:
          id: Error
          properties:
            error:
              type: string
    """
    notification = find_notification(notification_id)

    if notification:
        app.logger.info("Notification with id %d found", notification_id)
        return jsonify(notification), 200

    app.logger.info("Notification with id %d not found", notification_id)
    return jsonify({"error": "Notification not found"}), 404

# >>>>>>>>>>>>>> Add new notification <<<<<<<<<<<<

@app.route('/notifications', methods=['POST'])
def add_notification():
    """
    Add a new notification
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            users:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
            type:
              type: string
            content:
              type: string
            status:
              type: string
    responses:
      201:
        description: notification created
      400:
        description: Invalid input
    """

    try:
        data = notifications_schema.load(request.get_json())
    except ValidationError as err:
        app.logger.info("Invalid notification data: %s", err.messages)
        return jsonify(err.messages), 400

    app.logger.info("Adding new notification: %s", data)

    notifications = load_notifications()
    new_notification = {
        "id": notifications[-1]["id"] + 1 if notifications else 1,
        **data
    }

    notifications.append(new_notification)
    save_notifications(notifications)
    return jsonify(new_notification), 201

# >>>>>>>>>>>>>> Update notification by ID <<<<<<<<<<<<

@app.route('/notifications/<int:notification_id>', methods=['PUT'])
def update_notification(notification_id):
    """Update an existing notification
    ---
    parameters:
      - name: notification_id
        in: path
        type: integer
        required: true
      - name: body
        in: body
        required: true
        schema:
          id: notification
          type: object
          properties:
            users:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
            type:
              type: string
            content:
              type: string
            status:
              type: string
    responses:
      200:
        description: Notification updated
      404:
        description: Notification not found
    """
    notifications = load_notifications()

    try:
        data = notifications_schema.load(request.get_json())
    except ValidationError as err:
        app.logger.info("Invalid notification data: %s", err.messages)
        return jsonify(err.messages), 400

    for notification in notifications:
        if notification["id"] == notification_id:
            notification.update(data)
            save_notifications(notifications)
            return jsonify(notification), 200

    return jsonify({"error": "Notification not found"}), 404

# >>>>>>>>>>>>>> Delete notification by ID <<<<<<<<<<<<

@app.route('/notifications/<int:notification_id>', methods=['DELETE'])
def delete_notification(notification_id):
    """Delete a notification by ID
    ---
    parameters:
      - name: notification_id
        in: path
        type: integer
        required: true
    responses:
      204:
        description: Notification deleted
      404:
        description: Notification not found
    """
    notifications = load_notifications()
    if not any(notification["id"] == notification_id for notification in notifications):
        return jsonify({"error": "Notification not found"}), 404

    notifications = [notification for notification in notifications if notification["id"] != notification_id]
    save_notifications(notifications)
    return "", 204

# ------------------------------ Main -----------------------------
if __name__ == '__main__':
    app.run(debug=True, port=5004)
