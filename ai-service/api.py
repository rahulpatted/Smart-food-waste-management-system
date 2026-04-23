from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field
from model import predict, predict_week, record_data

app = FastAPI(title="Smart Food Waste AI Engine")

# --- Validation Models ---
class PredictionRequest(BaseModel):
    day: int = Field(..., ge=1, le=7, description="Day of week (1=Mon, 7=Sun)")
    attendance: int = Field(..., gt=0, description="Expected student attendance")

class IngestRequest(BaseModel):
    day: int = Field(..., ge=1, le=7)
    attendance: int = Field(..., gt=0)
    actual_meals: int = Field(..., gt=0)

# --- Routes ---

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "AI Engine"}

@app.get("/predict")
def get_prediction(day: int, attendance: int):
    """Simple prediction for a single day"""
    if not (1 <= day <= 7):
        raise HTTPException(status_code=400, detail="Day must be between 1 and 7")
    if attendance <= 0:
        raise HTTPException(status_code=400, detail="Attendance must be greater than 0")
    
    result = predict(day, attendance)
    return {
        "prediction": result,
        "input": {"day": day, "attendance": attendance}
    }

@app.get("/forecast_week")
def get_weekly_forecast(attendance: int = Query(100, gt=0)):
    """Generates a rolling 7-day forecast"""
    predictions = predict_week(attendance)
    return {
        "forecast": predictions,
        "baseline_attendance": attendance
    }

@app.post("/train")
def ingest_data(data: IngestRequest):
    """Accepts actual outcomes to retrain the model in real-time"""
    success = record_data(data.day, data.attendance, data.actual_meals)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update model")
    
    return {"message": "Model updated successfully with new data point"}