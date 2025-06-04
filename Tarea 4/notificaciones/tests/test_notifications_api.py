import pytest
import os
import json
from app import app, DATA_FILE

@pytest.fixture
def client():
    app.testing = True
    client = app.test_client()

    # Clean up the data file before each test
    if os.path.exists(DATA_FILE):
        os.remove(DATA_FILE)
    yield client

def test_get_notifications_empty(client):
    response = client.get('/notifications')
    assert response.status_code == 200
    assert response.get_json() == []

def test_add_notification_missing_user(client, monkeypatch):
    def fake_get(url):
        class FakeResponse:
            status_code = 404
        return FakeResponse()
    monkeypatch.setattr("requests.get", fake_get)

    notification = {
        "users": [{"id": 1}],
        "type": "info",
        "content": "Hello world",
        "status": "sent"
    }

    res = client.post('/notifications', json=notification)
    assert res.status_code == 404
    assert "error" in res.get_json()

def test_add_notification_success(client, monkeypatch):
    def fake_get(url):
        class FakeResponse:
            status_code = 200
        return FakeResponse()
    monkeypatch.setattr("requests.get", fake_get)

    new_notif = {
        "users": [{"id": 1}],
        "type": "info",
        "content": "Test message",
        "status": "sent"
    }

    res = client.post('/notifications', json=new_notif)
    assert res.status_code == 201
    data = res.get_json()
    assert data["id"] == 1
    assert data["type"] == "info"
