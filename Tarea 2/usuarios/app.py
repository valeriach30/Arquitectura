import json
import os
from flask import Flask, jsonify, request
from marshmallow import Schema, fields, ValidationError
from flasgger import Swagger
import logging

DATA_FILE = "users.json"

# ---------------------------- Logging ----------------------------

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
swagger = Swagger(app, template={
    "info": {
        "title": "Users API",
        "version": "1.0",
        "description": "This is a simple API to manage users with JSON file persistence.",
    }
})

#  ---------------------------- Schema ----------------------------
class UsersSchema(Schema):
    name = fields.String(required=True)
    email = fields.String(required=True)
    phone = fields.String(required=True)
    isOrganizer = fields.Boolean(required=True)

user_schema = UsersSchema()

#  ------------------------ File Helpers --------------------------

def load_users():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as fileVar:
        return json.load(fileVar)

def save_users(users):
    with open(DATA_FILE, "w") as fileVar:
        json.dump(users, fileVar, indent=2)

def find_user(user_id):
    users = load_users()
    return next((user for user in users if user["id"] == user_id), None)

# ----------------------------- Routes ----------------------------

# >>>>>>>>>>>>>> Get all users <<<<<<<<<<<<

@app.route('/users', methods=['GET'])
def get_users():
    """Get all users
    ---
    responses:
      200:
        description: List of users
    """
    users = load_users()
    app.logger.info(
        "Returning list of users with length: %d", len(users))
    return jsonify(users), 200

# >>>>>>>>>>>>>> Get user by ID <<<<<<<<<<<<

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """
    Get user by ID
    ---
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: User found
        schema:
          id: user
          properties:
            id:
              type: integer
            name:
              type: string
            email:
              type: string
            phone:
              type: string
            isOrganizer:
              type: boolean
      404:
        description: User not found
        schema:
          id: Error
          properties:
            error:
              type: string
    """
    user = find_user(user_id)

    if user:
        app.logger.info("User with id %d found", user_id)
        return jsonify(user), 200

    app.logger.info("User with id %d not found", user_id)
    return jsonify({"error": "User not found"}), 404

# >>>>>>>>>>>>>> Add new user <<<<<<<<<<<<

@app.route('/users', methods=['POST'])
def add_user():
    """
    Add a new user
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            name:
              type: string
            email:
              type: string
            phone:
              type: string
            isOrganizer:
              type: boolean
    responses:
      201:
        description: User created
      400:
        description: Invalid input
    """

    try:
        data = user_schema.load(request.get_json())
    except ValidationError as err:
        app.logger.info("Invalid user data: %s", err.messages)
        return jsonify(err.messages), 400

    app.logger.info("Adding new user: %s", data)

    users = load_users()
    new_user = {
        "id": users[-1]["id"] + 1 if users else 1,
        **data
    }

    users.append(new_user)
    save_users(users)
    return jsonify(new_user), 201

# >>>>>>>>>>>>>> Update user by ID <<<<<<<<<<<<

@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Update an existing user
    ---
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
      - name: body
        in: body
        required: true
        schema:
          id: user
          type: object
          properties:
            name:
              type: string
            email:
              type: string
            phone:
              type: string
            isOrganizer:
              type: boolean
    responses:
      200:
        description: User updated
      404:
        description: User not found
    """
    users = load_users()

    try:
        data = user_schema.load(request.get_json())
    except ValidationError as err:
        app.logger.info("Invalid user data: %s", err.messages)
        return jsonify(err.messages), 400

    for user in users:
        if user["id"] == user_id:
            user.update(data)
            save_users(users)
            return jsonify(user), 200

    return jsonify({"error": "User not found"}), 404

# >>>>>>>>>>>>>> Delete user by ID <<<<<<<<<<<<

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete a user by ID
    ---
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
    responses:
      204:
        description: User deleted
      404:
        description: User not found
    """
    users = load_users()
    if not any(user["id"] == user_id for user in users):
        return jsonify({"error": "User not found"}), 404

    users = [user for user in users if user["id"] != user_id]
    save_users(users)
    return "", 204

# ------------------------------ Main -----------------------------
if __name__ == '__main__':
    app.run(debug=True, port=5003)
