import json
import os
from flask import Flask, request, jsonify, g
from marshmallow import Schema, fields, ValidationError
from flasgger import Swagger
import logging
import requests
from dotenv import load_dotenv
import os
import requests
from log_utils import init_logging, CORRELATION_ID_HEADER
import uuid

load_dotenv("config.env")

DATA_FILE = "tickets.json"
USERS_SERVICE = os.getenv("USUARIOS_SERVICE")
EVENTS_SERVICE = os.getenv("EVENTOS_SERVICE")

# ---------------------------- Flask App ---------------------------

app = Flask(__name__)
swagger = Swagger(app, template={
    "info": {
        "title": "Tickets API",
        "version": "1.0",
        "description": "This is a simple API to manage tickets with JSON file persistence.",
    }
})

# ---------------------------- Logging ----------------------------

logging.basicConfig(level=logging.INFO)

# Initialize logging with correlation ID support
init_logging()


# Before request, set a correlation ID
@app.before_request
def set_correlation_id():
    g.correlation_id = request.headers.get(
        CORRELATION_ID_HEADER, str(uuid.uuid4()))

# After request, add the correlation ID to the response headers
@app.after_request
def add_correlation_id_to_response(response):
    response.headers[CORRELATION_ID_HEADER] = g.correlation_id
    return response


#  ---------------------------- Schema ----------------------------
class TicketsSchema(Schema):
    buyerId = fields.Integer(required=True)
    eventId = fields.Integer(required=True)
    type = fields.String(required=True)
    price = fields.Integer(required=True)
    status = fields.String(required=True)

tickets_schema = TicketsSchema()

#  ------------------------ File Helpers --------------------------

def load_tickets():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as fileVar:
        return json.load(fileVar)

def save_tickets(tickets):
    with open(DATA_FILE, "w") as fileVar:
        json.dump(tickets, fileVar, indent=2)

def find_ticket(ticket_id):
    tickets = load_tickets()
    return next((ticket for ticket in tickets if ticket["id"] == ticket_id), None)

# ----------------------------- Routes ----------------------------

# >>>>>>>>>>>>>> Get all tickets <<<<<<<<<<<<

@app.route('/tickets', methods=['GET'])
def get_tickets():
    """Get all tickets
    ---
    responses:
      200:
        description: List of tickets
    """
    tickets = load_tickets()
    app.logger.info(
        "Returning list of tickets with length: %d", len(tickets))
    return jsonify(tickets), 200

# >>>>>>>>>>>>>> Get ticket by ID <<<<<<<<<<<<

@app.route('/tickets/<int:ticket_id>', methods=['GET'])
def get_ticket(ticket_id):
    """
    Get ticket by ID
    ---
    parameters:
      - name: ticket_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Ticket found
        schema:
          id: ticket
          properties:
            id:
              type: integer
            buyerId:
              type: integer
            eventId:
              type: integer
            type:
              type: string
            price:
              type: integer
            status:
              type: string
      404:
        description: Ticket not found
        schema:
          id: Error
          properties:
            error:
              type: string
    """
    ticket = find_ticket(ticket_id)

    if ticket:
        app.logger.info("Ticket with id %d found", ticket_id)
        return jsonify(ticket), 200

    app.logger.info("Ticket with id %d not found", ticket_id)
    return jsonify({"error": "Ticket not found"}), 404

# >>>>>>>>>>>>>> Add new ticket <<<<<<<<<<<<

@app.route('/tickets', methods=['POST'])
def add_ticket():
    """
    Add a new ticket
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            buyerId:
              type: integer
            eventId:
              type: integer
            type:
              type: string
            price:
              type: integer
            status:
              type: string
    responses:
      201:
        description: Ticket created
      400:
        description: Invalid input
    """

    try:
        data = tickets_schema.load(request.get_json())
    except ValidationError as err:
        app.logger.info("Invalid ticket data: %s", err.messages)
        return jsonify(err.messages), 400

    # Validate buyerId
    app.logger.info("Calling users service to validate buyer %d with correlation_id: %s",
                    data['buyerId'], g.correlation_id)
    buyer_response = requests.get(
        f"{USERS_SERVICE}/users/{data['buyerId']}",
        headers={CORRELATION_ID_HEADER: g.correlation_id}
    )
    app.logger.info("Users service response for buyer %d: status=%d, correlation_id: %s",
                    data['buyerId'], buyer_response.status_code, g.correlation_id)
    if buyer_response.status_code != 200:
        return jsonify({"error": "Buyer not found"}), 404

    # Validate eventId
    app.logger.info("Calling events service to validate event %d with correlation_id: %s",
                    data['eventId'], g.correlation_id)
    event_response = requests.get(
        f"{EVENTS_SERVICE}/events/{data['eventId']}",
        headers={CORRELATION_ID_HEADER: g.correlation_id}
    )
    app.logger.info("Events service response for event %d: status=%d, correlation_id: %s",
                    data['eventId'], event_response.status_code, g.correlation_id)
    if event_response.status_code != 200:
        return jsonify({"error": "Event not found"}), 404


    app.logger.info("Adding new ticket: %s", data)

    tickets = load_tickets()
    new_ticket = {
        "id": tickets[-1]["id"] + 1 if tickets else 1,
        **data
    }

    tickets.append(new_ticket)
    save_tickets(tickets)
    return jsonify(new_ticket), 201

# >>>>>>>>>>>>>> Update ticket by ID <<<<<<<<<<<<

@app.route('/tickets/<int:ticket_id>', methods=['PUT'])
def update_ticket(ticket_id):
    """Update an existing ticket
    ---
    parameters:
      - name: ticket_id
        in: path
        type: integer
        required: true
      - name: body
        in: body
        required: true
        schema:
          id: ticket
          type: object
          properties:
            buyerId:
              type: integer
            eventId:
              type: integer
            type:
              type: string
            price:
              type: integer
            status:
              type: string
    responses:
      200:
        description: Ticket updated
      404:
        description: Ticket not found
    """
    # Validate request data
    try:
        data = tickets_schema.load(request.get_json())
    except ValidationError as err:
        app.logger.info("Invalid ticket data: %s", err.messages)
        return jsonify(err.messages), 400

    # Validate buyerId
    app.logger.info("Calling users service to validate buyer %d with correlation_id: %s",
                    data['buyerId'], g.correlation_id)
    buyer_response = requests.get(
        f"{USERS_SERVICE}/users/{data['buyerId']}",
        headers={CORRELATION_ID_HEADER: g.correlation_id}
    )
    app.logger.info("Users service response for buyer %d: status=%d, correlation_id: %s",
                    data['buyerId'], buyer_response.status_code, g.correlation_id)
    if buyer_response.status_code != 200:
        return jsonify({"error": "Buyer not found"}), 404

    # Validate eventId
    app.logger.info("Calling events service to validate event %d with correlation_id: %s",
                    data['eventId'], g.correlation_id)
    event_response = requests.get(
        f"{EVENTS_SERVICE}/events/{data['eventId']}",
        headers={CORRELATION_ID_HEADER: g.correlation_id}
    )
    app.logger.info("Events service response for event %d: status=%d, correlation_id: %s",
                    data['eventId'], event_response.status_code, g.correlation_id)
    if event_response.status_code != 200:
        return jsonify({"error": "Event not found"}), 404

    tickets = load_tickets()

    for ticket in tickets:
        if ticket["id"] == ticket_id:
            ticket.update(data)
            save_tickets(tickets)
            return jsonify(ticket), 200

    return jsonify({"error": "Ticket not found"}), 404

# >>>>>>>>>>>>>> Delete ticket by ID <<<<<<<<<<<<

@app.route('/tickets/<int:ticket_id>', methods=['DELETE'])
def delete_ticket(ticket_id):
    """Delete a ticket by ID
    ---
    parameters:
      - name: ticket_id
        in: path
        type: integer
        required: true
    responses:
      204:
        description: Ticket deleted
      404:
        description: Ticket not found
    """
    tickets = load_tickets()
    if not any(ticket["id"] == ticket_id for ticket in tickets):
        return jsonify({"error": "Ticket not found"}), 404

    tickets = [ticket for ticket in tickets if ticket["id"] != ticket_id]
    save_tickets(tickets)
    return "", 204

# ------------------------------ Main -----------------------------
if __name__ == '__main__':
    app.run(debug=True, port=5001)
