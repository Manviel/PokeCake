from fastapi import APIRouter, HTTPException

from services.analytics import (
    detect_anomalies,
    get_telemetry_history,
    train_model_and_forecast,
)

router = APIRouter()


@router.get("/{serial_number}/history")
async def get_history(serial_number: str):
    """
    Get historical telemetry data for a device.
    """
    history = await get_telemetry_history(serial_number)
    if not history:
        raise HTTPException(status_code=404, detail="No history found for this device")

    # Convert ObjectIDs to strings if needed, though they shouldn't be in the simple list if not handled.
    # But usually mongo returns _id. Let's fix that in service or here.
    # Service returns list of dicts.
    for entry in history:
        if "_id" in entry:
            entry["_id"] = str(entry["_id"])

    return history


@router.get("/{serial_number}/forecast")
async def get_forecast(serial_number: str):
    """
    Get AI-driven forecast for the device.
    """
    prediction = await train_model_and_forecast(serial_number)
    if "error" in prediction:
        raise HTTPException(status_code=400, detail=prediction["error"])
    return prediction


@router.get("/{serial_number}/anomalies")
async def get_anomalies(serial_number: str):
    """
    Get detected anomalies in recent data.
    """
    anomalies = await detect_anomalies(serial_number)
    return anomalies
