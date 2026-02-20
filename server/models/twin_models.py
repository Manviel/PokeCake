import uuid
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


def generate_serial():
    return f"QX{uuid.uuid4().hex[:8].upper()}"


class ProductTwinCreate(BaseModel):
    name: str = Field(default="iPhone 15 Pro")
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
    serial_number: str
    os_version: str
    battery_health: int
    cpu_usage: int = 0
    temperature: float = 25.0
    is_charging: bool = False
    last_synced: datetime

    class Config:
        populate_by_name = True


class SaleRecordCreate(BaseModel):
    serial_number: str
    price_usd: float = Field(..., gt=0, description="Sale price in USD")
    region: Literal["US", "EU", "APAC", "LATAM"] = Field(default="US")
    channel: Literal["online", "retail", "B2B"] = Field(default="online")
    customer_segment: Literal["consumer", "enterprise", "education"] = Field(
        default="consumer"
    )
    sold_at: datetime = Field(default_factory=datetime.utcnow)


class SaleRecord(SaleRecordCreate):
    id: str = Field(..., alias="_id")

    class Config:
        populate_by_name = True


class DeviceAnalytics(BaseModel):
    serial_number: str
    last_analyzed: datetime = Field(default_factory=datetime.utcnow)
    health_score: int = Field(
        ..., ge=0, le=100, description="Overall device health score (0-100)"
    )
    predicted_failure_date: Optional[datetime] = None
    anomalies: list[dict] = Field(default_factory=list)
    usage_trend: str = Field(..., pattern="^(increasing|decreasing|stable)$")
    # Sales-derived risk fields (None when no sale record exists)
    revenue_at_risk: Optional[float] = None
    return_risk_flag: Optional[bool] = None
    days_since_sale: Optional[int] = None

    class Config:
        populate_by_name = True
