import json
import os
from flask import Flask, jsonify, request
from marshmallow import Schema, fields, ValidationError
from flasgger import Swagger
import logging

DATA_FILE = "eventos.json"

# ---------------------------- Logging ----------------------------

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
swagger = Swagger(app, template={
    "info": {
        "title": "Events API",
        "version": "1.0",
        "description": "This is a simple API to manage events with JSON file persistence.",
    }
})

#  ---------------------------- Schema ----------------------------
class EventsSchema(Schema):
    organizerId = fields.Integer(required=True)
    name = fields.String(required=True)
    date = fields.String(required=True)
    location = fields.String(required=True)
    description = fields.String(required=True)
    capacity = fields.Integer(required=True)

events_schema = EventsSchema()

#  ------------------------ File Helpers --------------------------

def load_events():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as fileVar:
        return json.load(fileVar)

def save_events(events):
    with open(DATA_FILE, "w") as fileVar:
        json.dump(events, fileVar, indent=2)

def find_event(event_id):
    events = load_events()
    return next((event for event in events if event["id"] == event_id), None)

# ----------------------------- Routes ----------------------------

# >>>>>>>>>>>>>> Get all events <<<<<<<<<<<<

@app.route('/events', methods=['GET'])
def get_events():
    """Get all events
    ---
    responses:
      200:
        description: List of events
    """
    events = load_events()
    app.logger.info(
        "Returning list of events with length: %d", len(events))
    return jsonify(events), 200

# >>>>>>>>>>>>>> Get event by ID <<<<<<<<<<<<

@app.route('/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    """
    Get event by ID
    ---
    parameters:
      - name: event_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Event found
        schema:
          id: event
          properties:
            id:
              type: integer
            organizerId:
              type: integer
            name:
              type: string
            date:
              type: string
            location:
              type: string
            description:
              type: string
            capacity:
              type: integer

      404:
        description: Event not found
        schema:
          id: Error
          properties:
            error:
              type: string
    """
    event = find_event(event_id)

    if event:
        app.logger.info("Event with id %d found", event_id)
        return jsonify(event), 200

    app.logger.info("Event with id %d not found", event_id)
    return jsonify({"error": "Event not found"}), 404

# >>>>>>>>>>>>>> Add new event <<<<<<<<<<<<

@app.route('/events', methods=['POST'])
def add_event():
    """
    Add a new event
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            organizerId:
              type: integer
            name:
              type: string
            date:
              type: string
            location:
              type: string
            description:
              type: string
            capacity:
              type: integer
    responses:
      201:
        description: Event created
      400:
        description: Invalid input
    """

    try:
        data = events_schema.load(request.get_json())
    except ValidationError as err:
        app.logger.info("Invalid event data: %s", err.messages)
        return jsonify(err.messages), 400

    app.logger.info("Adding new event: %s", data)

    events = load_events()
    new_event = {
        "id": events[-1]["id"] + 1 if events else 1,
        **data
    }

    events.append(new_event)
    save_events(events)
    return jsonify(new_event), 201

# >>>>>>>>>>>>>> Update event by ID <<<<<<<<<<<<

@app.route('/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    """Update an existing event
    ---
    parameters:
      - name: event_id
        in: path
        type: integer
        required: true
      - name: body
        in: body
        required: true
        schema:
          id: event
          type: object
          properties:
            organizerId:
              type: integer
            name:
              type: string
            date:
              type: string
            location:
              type: string
            description:
              type: string
            capacity:
              type: integer
    responses:
      200:
        description: Event updated
      404:
        description: Event not found
    """
    events = load_events()

    try:
        data = events_schema.load(request.get_json())
    except ValidationError as err:
        app.logger.info("Invalid event data: %s", err.messages)
        return jsonify(err.messages), 400

    for event in events:
        if event["id"] == event_id:
            event.update(data)
            save_events(events)
            return jsonify(event), 200

    return jsonify({"error": "Event not found"}), 404

# >>>>>>>>>>>>>> Delete event by ID <<<<<<<<<<<<

@app.route('/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    """Delete a event by ID
    ---
    parameters:
      - name: event_id
        in: path
        type: integer
        required: true
    responses:
      204:
        description: Event deleted
      404:
        description: Event not found
    """
    events = load_events()
    if not any(event["id"] == event_id for event in events):
        return jsonify({"error": "Event not found"}), 404

    events = [event for event in events if event["id"] != event_id]
    save_events(events)
    return "", 204

# ------------------------------ Main -----------------------------
if __name__ == '__main__':
    app.run(debug=True, port=5002)
