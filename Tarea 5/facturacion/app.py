import json
import os
from flask import Flask, jsonify, request, g
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

DATA_FILE = "bills.json"
USERS_SERVICE = os.getenv("USUARIOS_SERVICE")
EVENTS_SERVICE = os.getenv("EVENTOS_SERVICE")

# ---------------------------- Flask App ---------------------------

app = Flask(__name__)
swagger = Swagger(app, template={
    "info": {
        "title": "Bills API",
        "version": "1.0",
        "description": "This is a simple API to manage bills with JSON file persistence.",
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

# ---------------------------- Schema ----------------------------
class BillsSchema(Schema):
    userId = fields.Integer(required=True)
    eventId = fields.Integer(required=True)
    amount = fields.Float(required=True)
    details = fields.String(required=True)
    date = fields.String(required=True)

bills_schema = BillsSchema()

#  ------------------------ File Helpers --------------------------

def load_bills():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as fileVar:
        return json.load(fileVar)

def save_bills(bills):
    with open(DATA_FILE, "w") as fileVar:
        json.dump(bills, fileVar, indent=2)

def find_bill(bill_id):
    bills = load_bills()
    return next((bill for bill in bills if bill["id"] == bill_id), None)

# ----------------------------- Routes ----------------------------

# >>>>>>>>>>>>>> Get all bills <<<<<<<<<<<<

@app.route('/bills', methods=['GET'])
def get_bills():
    """Get all bills
    ---
    responses:
      200:
        description: List of bills
    """
    bills = load_bills()
    app.logger.info(
        "Returning list of bills with length: %d", len(bills))
    return jsonify(bills), 200

# >>>>>>>>>>>>>> Get bill by ID <<<<<<<<<<<<

@app.route('/bills/<int:bill_id>', methods=['GET'])
def get_bill(bill_id):
    """
    Get bill by ID
    ---
    parameters:
      - name: bill_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Bill found
        schema:
          id: bill
          properties:
            id:
              type: integer
            userId:
              type: integer
            eventId:
              type: integer
            amount:
              type: number
            details:
              type: string
            date:
              type: string
      404:
        description: Bill not found
        schema:
          id: Error
          properties:
            error:
              type: string
    """
    bill = find_bill(bill_id)

    if bill:
        app.logger.info("Bill with id %d found", bill_id)
        return jsonify(bill), 200

    app.logger.info("Bill with id %d not found", bill_id)
    return jsonify({"error": "Bill not found"}), 404

# >>>>>>>>>>>>>> Add new bill <<<<<<<<<<<<

@app.route('/bills', methods=['POST'])
def add_bill():
    """
    Add a new bill
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            userId:
              type: integer
            eventId:
              type: integer
            amount:
              type: number
            details:
              type: string
            date:
              type: string
    responses:
      201:
        description: Bill created
      400:
        description: Invalid input
    """

    try:
        data = bills_schema.load(request.get_json())
    except ValidationError as err:
        app.logger.info("Invalid bill data: %s", err.messages)
        return jsonify(err.messages), 400

    # Validate userId
    app.logger.info("Calling users service to validate user %d with correlation_id: %s",
                    data['userId'], g.correlation_id)
    buyer_response = requests.get(
        f"{USERS_SERVICE}/users/{data['userId']}",
        headers={CORRELATION_ID_HEADER: g.correlation_id}
    )
    if buyer_response.status_code != 200:
        return jsonify({"error": "User not found"}), 404

    # Validate eventId
    app.logger.info("Calling events service to validate event %d with correlation_id: %s",
                    data['eventId'], g.correlation_id)
    event_response = requests.get(
        f"{EVENTS_SERVICE}/events/{data['eventId']}",
        headers={CORRELATION_ID_HEADER: g.correlation_id}
    )
    if event_response.status_code != 200:
        return jsonify({"error": "Event not found"}), 404

    app.logger.info("Adding new bill: %s", data)

    bills = load_bills()
    new_bill = {
        "id": bills[-1]["id"] + 1 if bills else 1,
        **data
    }

    bills.append(new_bill)
    save_bills(bills)
    return jsonify(new_bill), 201

# >>>>>>>>>>>>>> Update bill by ID <<<<<<<<<<<<

@app.route('/bills/<int:bill_id>', methods=['PUT'])
def update_bill(bill_id):
    """Update an existing bill
    ---
    parameters:
      - name: bill_id
        in: path
        type: integer
        required: true
      - name: body
        in: body
        required: true
        schema:
          id: bill
          type: object
          properties:
            userId:
              type: integer
            eventId:
              type: integer
            amount:
              type: number
            details:
              type: string
            date:
              type: string
    responses:
      200:
        description: Bill updated
      404:
        description: Bill not found
    """

    try:
        data = bills_schema.load(request.get_json())
    except ValidationError as err:
        app.logger.info("Invalid Bill data: %s", err.messages)
        return jsonify(err.messages), 400

    # Validate userId
    app.logger.info("Calling users service to validate user %d with correlation_id: %s",
                    data['userId'], g.correlation_id)
    buyer_response = requests.get(
        f"{USERS_SERVICE}/users/{data['userId']}",
        headers={CORRELATION_ID_HEADER: g.correlation_id}
    )
    if buyer_response.status_code != 200:
        return jsonify({"error": "User not found"}), 404

    # Validate eventId
    app.logger.info("Calling events service to validate event %d with correlation_id: %s",
                    data['eventId'], g.correlation_id)
    event_response = requests.get(
        f"{EVENTS_SERVICE}/events/{data['eventId']}",
        headers={CORRELATION_ID_HEADER: g.correlation_id}
    )
    if event_response.status_code != 200:
        return jsonify({"error": "Event not found"}), 404

    bills = load_bills()

    for bill in bills:
        if bill["id"] == bill_id:
            bill.update(data)
            save_bills(bills)
            return jsonify(bill), 200

    return jsonify({"error": "Bill not found"}), 404

# >>>>>>>>>>>>>> Delete bill by ID <<<<<<<<<<<<

@app.route('/bills/<int:bill_id>', methods=['DELETE'])
def delete_bill(bill_id):
    """Delete a bill by ID
    ---
    parameters:
      - name: bill_id
        in: path
        type: integer
        required: true
    responses:
      204:
        description: Bill deleted
      404:
        description: Bill not found
    """
    bills = load_bills()
    if not any(bill["id"] == bill_id for bill in bills):
        return jsonify({"error": "Bill not found"}), 404

    bills = [bill for bill in bills if bill["id"] != bill_id]
    save_bills(bills)
    return "", 204

# ------------------------------ Main -----------------------------
if __name__ == '__main__':
    app.run(debug=True, port=5005)
