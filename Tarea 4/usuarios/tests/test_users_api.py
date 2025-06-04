import json
import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_get_users_empty(client):
    rv = client.get('/users')
    assert rv.status_code == 200
    assert rv.get_json() == []

def test_add_user(client):
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "phone": "1234567890",
        "isOrganizer": True
    }
    rv = client.post('/users', json=user_data)
    assert rv.status_code == 201
    data = rv.get_json()
    assert data["name"] == "Test User"
    assert "id" in data

def test_get_user(client):
    user_data = {
        "name": "Test User 2",
        "email": "test2@example.com",
        "phone": "0987654321",
        "isOrganizer": False
    }
    post_resp = client.post('/users', json=user_data)
    user_id = post_resp.get_json()["id"]

    rv = client.get(f'/users/{user_id}')
    assert rv.status_code == 200
    user = rv.get_json()
    assert user["id"] == user_id
    assert user["email"] == "test2@example.com"

def test_delete_user(client):
    user_data = {
        "name": "User to delete",
        "email": "delete@example.com",
        "phone": "000111222",
        "isOrganizer": False
    }
    post_resp = client.post('/users', json=user_data)
    user_id = post_resp.get_json()["id"]

    del_resp = client.delete(f'/users/{user_id}')
    assert del_resp.status_code == 204

    get_resp = client.get(f'/users/{user_id}')
    assert get_resp.status_code == 404
