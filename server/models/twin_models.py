from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ProductTwinBase(BaseModel):
    name: str = Field(..., example="iPhone 15 Pro")
    model_identifier: str = Field(..., example="iPhone16,1")
    serial_number: str = Field(..., example="QX12345678")
    os_version: str = Field(..., example="iOS 17.4")
    battery_health: int = Field(..., ge=0, le=100, example=98)
    warranty_status: str = Field(..., example="AppleCare+ Active")
    last_synced: datetime = Field(default_factory=datetime.utcnow)

class ProductTwinCreate(ProductTwinBase):
    pass

class ProductTwinUpdate(BaseModel):
    name: Optional[str] = None
    os_version: Optional[str] = None
    battery_health: Optional[int] = None
    warranty_status: Optional[str] = None

class ProductTwin(ProductTwinBase):
    id: str = Field(..., alias="_id")

    class Config:
        populate_by_name = True
