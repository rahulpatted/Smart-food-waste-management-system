"""
Pytest tests for FastAPI endpoints
Tests API functionality and health checks
"""

import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api import app

client = TestClient(app)


class TestHealthCheck:
    """Test health check endpoint"""
    
    def test_health_check_status_code(self):
        """Test health check returns 200"""
        response = client.get("/health")
        assert response.status_code == 200
    
    def test_health_check_response_format(self):
        """Test health check response format"""
        response = client.get("/health")
        data = response.json()
        assert "status" in data
        assert data["status"] == "ok"
        assert "service" in data
        assert data["service"] == "AI Engine"


class TestPredictionEndpoint:
    """Test prediction endpoints"""
    
    def test_predict_valid_request(self):
        """Test prediction with valid parameters"""
        response = client.get("/predict?day=1&attendance=100")
        assert response.status_code == 200
        data = response.json()
        assert "prediction" in data
        assert data["prediction"] > 0
    
    def test_predict_invalid_day_low(self):
        """Test prediction with invalid day (too low)"""
        response = client.get("/predict?day=0&attendance=100")
        assert response.status_code == 400
    
    def test_predict_invalid_day_high(self):
        """Test prediction with invalid day (too high)"""
        response = client.get("/predict?day=8&attendance=100")
        assert response.status_code == 400
    
    def test_predict_invalid_attendance(self):
        """Test prediction with invalid attendance"""
        response = client.get("/predict?day=1&attendance=0")
        assert response.status_code == 400
    
    def test_predict_missing_parameters(self):
        """Test prediction with missing parameters"""
        response = client.get("/predict?day=1")
        assert response.status_code == 422  # Unprocessable Entity


class TestForecastEndpoint:
    """Test forecast endpoint"""
    
    def test_forecast_week_valid(self):
        """Test weekly forecast with valid attendance"""
        response = client.get("/forecast_week?attendance=100")
        assert response.status_code == 200
        data = response.json()
        assert "forecast" in data
        assert isinstance(data["forecast"], list)
        assert len(data["forecast"]) == 7
    
    def test_forecast_week_default_attendance(self):
        """Test weekly forecast with default attendance"""
        response = client.get("/forecast_week")
        assert response.status_code == 200
        data = response.json()
        assert "forecast" in data
        assert len(data["forecast"]) == 7
    
    def test_forecast_week_invalid_attendance(self):
        """Test weekly forecast with invalid attendance"""
        response = client.get("/forecast_week?attendance=0")
        assert response.status_code == 422


class TestResponseFormats:
    """Test response formats"""
    
    def test_all_responses_json(self):
        """Test that all endpoints return JSON"""
        endpoints = [
            "/health",
            "/predict?day=1&attendance=100",
            "/forecast_week?attendance=100",
        ]
        for endpoint in endpoints:
            response = client.get(endpoint)
            assert response.headers["content-type"].startswith("application/json")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
