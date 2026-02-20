from fastapi import APIRouter, HTTPException, status

from models.twin_models import SaleRecordCreate
from services.sales import create_sale_record, get_sale_by_serial, get_sales_summary

router = APIRouter()


@router.post("", status_code=status.HTTP_201_CREATED)
async def record_sale(sale: SaleRecordCreate):
    """
    Record or update a sale for a device twin.
    Upserts by serial_number, so re-submitting updates the existing record.
    """
    return await create_sale_record(sale.model_dump())


@router.get("/summary")
async def sales_summary():
    """
    Fleet-level sales dashboard: total revenue, revenue at risk, and breakdown by region/channel.
    """
    return await get_sales_summary()


@router.get("/{serial_number}")
async def get_sale(serial_number: str):
    """
    Retrieve the sale record for a specific device.
    """
    record = await get_sale_by_serial(serial_number)
    if not record:
        raise HTTPException(
            status_code=404, detail="No sale record found for this device"
        )
    return record
