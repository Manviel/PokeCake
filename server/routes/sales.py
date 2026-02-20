from fastapi import APIRouter, HTTPException, status

from models.twin_models import SaleRecordCreate
from services.sales import (
    create_sale_record,
    delete_sale_record,
    get_sales_by_serial,
    get_sales_summary,
    update_sale_record,
)

router = APIRouter()


@router.get("/summary")
async def sales_summary():
    """
    Fleet-level sales dashboard: total revenue, revenue at risk, and breakdown by region/channel.
    """
    return await get_sales_summary()


@router.post("", status_code=status.HTTP_201_CREATED)
async def record_sale(sale: SaleRecordCreate):
    """
    Record a new sale for a device twin.
    Each call creates a separate record — one twin can have multiple sale records.
    """
    return await create_sale_record(sale.model_dump())


@router.get("/{serial_number}")
async def get_sales(serial_number: str):
    """
    Retrieve all sale records for a specific device (newest first).
    Returns an empty list if the device has no sales.
    """
    return await get_sales_by_serial(serial_number)


@router.put("/{serial_number}/{sale_id}")
async def update_sale(serial_number: str, sale_id: str, sale: SaleRecordCreate):
    """
    Update an existing sale record by its ID.
    """
    record = await update_sale_record(sale_id, sale.model_dump())
    if not record:
        raise HTTPException(status_code=404, detail="Sale record not found")
    return record


@router.delete("/{serial_number}/{sale_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_sale(serial_number: str, sale_id: str):
    """
    Delete a single sale record by its ID.
    """
    deleted = await delete_sale_record(sale_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Sale record not found")
