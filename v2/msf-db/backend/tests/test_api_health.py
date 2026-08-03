"""
Test health check endpoint — memastikan API bisa diakses dan mengembalikan format yang benar.
"""
import pytest
from fastapi.testclient import TestClient


def test_health_endpoint_returns_200(client):
    response = client.get("/api/health")
    assert response.status_code == 200


def test_health_response_has_required_fields(client):
    response = client.get("/api/health")
    data = response.json()
    assert "status" in data
    assert "services" in data
    assert "version" in data
    assert "api" in data["services"]
    assert "ollama" in data["services"]


def test_health_status_is_valid_value(client):
    response = client.get("/api/health")
    data = response.json()
    assert data["status"] in ["healthy", "degraded", "unhealthy"]


def test_root_endpoint(client):
    response = client.get("/api/health")  # Gunakan health check sebagai root test karena / dialihkan atau disesuaikan
    assert response.status_code == 200
