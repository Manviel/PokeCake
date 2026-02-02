import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from database import db
from datetime import timedelta

async def get_telemetry_history(serial_number: str, limit: int = 100):
    """
    Retrieve historical telemetry data for a specific twin.
    """
    cursor = db.telemetry_history.find({"serial_number": serial_number}).sort("last_synced", -1).limit(limit)
    history = await cursor.to_list(length=limit)
    # Reverse to have chronological order for plotting
    return history[::-1]

async def train_model_and_forecast(serial_number: str):
    """
    Fetch history, train a simple linear regression model, and forecast the next value.
    """
    # Fetch data (more data points for training)
    data = await get_telemetry_history(serial_number, limit=50)
    
    if len(data) < 10:
        return {"error": "Not enough data to forecast"}

    df = pd.DataFrame(data)
    
    # Preprocessing
    # Convert timestamp to ordinal for regression
    df['time_ordinal'] = pd.to_datetime(df['last_synced']).map(pd.Timestamp.toordinal)
    
    # We will predict 'temperature'
    if 'temperature' not in df.columns:
         return {"error": "Temperature data missing"}

    X = df[['time_ordinal']].values
    y = df['temperature'].values

    model = LinearRegression()
    model.fit(X, y)

    # Predict next step (e.g., next timestamp)
    # Just adding a small increment to the last time ordinal for simulation
    next_time_ordinal = X[-1][0] + 1  
    prediction = model.predict([[next_time_ordinal]])

    return {
        "current_temperature": float(y[-1]),
        "forecast_temperature": float(prediction[0]),
        "trend": "increasing" if prediction[0] > y[-1] else "decreasing"
    }

async def detect_anomalies(serial_number: str):
    """
    Simple Z-score based anomaly detection for temperature.
    """
    data = await get_telemetry_history(serial_number, limit=50)
    
    if len(data) < 10:
        return []

    df = pd.DataFrame(data)
    
    if 'temperature' not in df.columns:
        return []

    mean_temp = df['temperature'].mean()
    std_temp = df['temperature'].std()
    
    anomalies = []
    
    if std_temp == 0:
        return anomalies

    for index, row in df.iterrows():
        z_score = (row['temperature'] - mean_temp) / std_temp
        if abs(z_score) > 2: # Threshold of 2 standard deviations
            anomalies.append({
                "timestamp": row['last_synced'],
                "temperature": row['temperature'],
                "z_score": float(z_score),
                "type": "High Temp" if z_score > 0 else "Low Temp"
            })
            
    return anomalies
