import uuid
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

def generate_serial():
    return f"QX{uuid.uuid4().hex[:8].upper()}"

class ProductTwinCreate(BaseModel):
    name: str = Field(default="iPhone 15 Pro")
    model_identifier: str = Field(default="iPhone16,1")
    serial_number: str = Field(default_factory=generate_serial)
    os_version: str = Field(default="iOS 17.4")
    battery_health: int = Field(default=100, ge=0, le=100)
    cpu_usage: int = Field(default=0, ge=0, le=100)
    temperature: float = Field(default=25.0)
    is_charging: bool = Field(default=False)
    last_synced: datetime = Field(default_factory=datetime.utcnow)

class ProductTwinUpdate(BaseModel):
    name: Optional[str] = None
    os_version: Optional[str] = None
    battery_health: Optional[int] = None
    cpu_usage: Optional[int] = None
    temperature: Optional[float] = None
    is_charging: Optional[bool] = None

class ProductTwin(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    model_identifier: str
    serial_number: str
    os_version: str
    battery_health: int
    cpu_usage: int = 0
    temperature: float = 25.0
    is_charging: bool = False
    last_synced: datetime

    class Config:
        populate_by_name = True
