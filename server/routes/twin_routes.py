from datetime import datetime
from typing import List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from database import get_database
from models.twin_models import ProductTwin, ProductTwinCreate, ProductTwinUpdate
from services.rabbitmq import publish_command

router = APIRouter()


@router.post("/twins", response_model=ProductTwin, status_code=status.HTTP_201_CREATED)
async def create_twin(twin: ProductTwinCreate, db=Depends(get_database)):
    twin_dict = twin.model_dump()
    result = await db.twins.insert_one(twin_dict)
    created_twin = await db.twins.find_one({"_id": result.inserted_id})
    created_twin["_id"] = str(created_twin["_id"])
    return created_twin


@router.get("/twins", response_model=List[ProductTwin])
async def list_twins(db=Depends(get_database)):
    twins = []
    cursor = db.twins.find()
    async for document in cursor:
        document["_id"] = str(document["_id"])
        twins.append(document)
    return twins


@router.get("/twins/{twin_id}", response_model=ProductTwin)
async def get_twin(twin_id: str, db=Depends(get_database)):
    if not ObjectId.is_valid(twin_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    twin = await db.twins.find_one({"_id": ObjectId(twin_id)})
    if twin:
        twin["_id"] = str(twin["_id"])
        return twin
    raise HTTPException(status_code=404, detail="Twin not found")


@router.put("/twins/{twin_id}", response_model=ProductTwin)
async def update_twin(
    twin_id: str, twin_update: ProductTwinUpdate, db=Depends(get_database)
):
    if not ObjectId.is_valid(twin_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    update_data = {k: v for k, v in twin_update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = await db.twins.update_one(
        {"_id": ObjectId(twin_id)}, {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Twin not found")

    updated_twin = await db.twins.find_one({"_id": ObjectId(twin_id)})
    updated_twin["_id"] = str(updated_twin["_id"])
    return updated_twin


@router.delete("/twins/{twin_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_twin(twin_id: str, db=Depends(get_database)):
    if not ObjectId.is_valid(twin_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    result = await db.twins.delete_one({"_id": ObjectId(twin_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Twin not found")
    return None


@router.post("/twins/{twin_id}/diagnostics")
async def run_diagnostics(twin_id: str, db=Depends(get_database)):
    if not ObjectId.is_valid(twin_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    twin = await db.twins.find_one({"_id": ObjectId(twin_id)})
    if not twin:
        raise HTTPException(status_code=404, detail="Twin not found")

    await publish_command(
        {
            "target_serial": twin["serial_number"],
            "action": "RUN_DIAGNOSTICS",
            "timestamp": str(datetime.utcnow()),
        }
    )

    return {
        "status": "triggered",
        "healthy": True,
        "message": "Diagnostics command dispatched to hardware via RabbitMQ.",
    }
