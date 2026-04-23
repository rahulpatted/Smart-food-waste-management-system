import pandas as pd
from sklearn.linear_model import LinearRegression
import os
import csv

# Path to the data file
data_path = os.path.join(os.path.dirname(__file__), "data.csv")

# Global model instance
model = LinearRegression()

def retrain():
    """Refit the model based on the latest data in data.csv"""
    global model
    try:
        data = pd.read_csv(data_path)
        if len(data) < 2:
            return False
            
        X = data[["day", "attendance"]]
        y = data["meals"]
        
        model = LinearRegression()
        model.fit(X, y)
        return True
    except Exception as e:
        print(f"Retraining error: {e}")
        return False

# Initial training on load
retrain()

def record_data(day, attendance, meals):
    """Append a new record to the CSV and trigger a retrain"""
    try:
        with open(data_path, "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerow([day, attendance, meals])
        
        # Trigger retraining so next prediction uses new data
        return retrain()
    except Exception as e:
        print(f"Error recording data: {e}")
        return False

def predict(day, attendance):
    """Predict meal count for a given day and attendance"""
    try:
        # Provide the feature names via a DataFrame to satisfy Scikit-Learn's expectations
        input_data = pd.DataFrame({"day": [day], "attendance": [attendance]})
        prediction = model.predict(input_data)[0]
        return round(max(0, prediction)) # Ensure no negative predictions
    except Exception:
        # Fallback to simple baseline if prediction fails
        return round(attendance * 0.8)

def predict_week(avg_attendance):
    """Generate predictions for a 7-day window"""
    predictions = []
    # Weighted multipliers for a typical week
    multipliers = [1.0, 1.05, 1.0, 1.1, 0.9, 0.6, 0.5] 
    for i in range(7):
        day = i + 1
        adj_attendance = avg_attendance * multipliers[i]
        predictions.append(predict(day, adj_attendance))
    return predictions