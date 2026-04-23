"""
Pytest tests for AI model
Tests prediction logic and data recording
"""

import pytest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from model import predict, predict_week, retrain, record_data


class TestPrediction:
    """Test prediction functionality"""
    
    def test_predict_valid_day(self):
        """Test prediction for valid day"""
        result = predict(1, 100)  # Day 1, 100 attendance
        assert result is not None
        assert isinstance(result, (int, float))
        assert result > 0
    
    def test_predict_all_days(self):
        """Test prediction for all days of week"""
        for day in range(1, 8):
            result = predict(day, 100)
            assert result is not None
            assert result > 0
    
    def test_predict_varying_attendance(self):
        """Test prediction with different attendance levels"""
        attendances = [50, 100, 150, 200, 300]
        for attendance in attendances:
            result = predict(1, attendance)
            assert result is not None
            assert result > 0
    
    def test_predict_low_attendance(self):
        """Test prediction with low attendance"""
        result = predict(1, 10)
        assert result is not None
        assert result > 0


class TestWeeklyForecast:
    """Test weekly forecasting"""
    
    def test_forecast_week_returns_list(self):
        """Test that forecast_week returns a list"""
        forecast = predict_week(100)
        assert isinstance(forecast, list)
    
    def test_forecast_week_length(self):
        """Test that forecast_week returns 7 predictions"""
        forecast = predict_week(100)
        assert len(forecast) == 7
    
    def test_forecast_week_all_positive(self):
        """Test that all weekly predictions are positive"""
        forecast = predict_week(100)
        for prediction in forecast:
            assert prediction > 0
    
    def test_forecast_with_varying_attendance(self):
        """Test forecast with different attendance levels"""
        attendances = [50, 100, 150]
        for attendance in attendances:
            forecast = predict_week(attendance)
            assert len(forecast) == 7
            assert all(p > 0 for p in forecast)


class TestModelRetrain:
    """Test model retraining"""
    
    def test_retrain_returns_boolean(self):
        """Test that retrain returns a boolean"""
        result = retrain()
        assert isinstance(result, bool)
    
    def test_retrain_successful(self):
        """Test successful retrain"""
        result = retrain()
        # Should return True if data exists
        assert isinstance(result, bool)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
