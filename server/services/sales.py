from bson import ObjectId

from database import db


async def create_sale_record(data: dict) -> dict:
    """
    Insert a new sale record for a device.
    A single twin can have multiple sale records (one per market segment / channel).
    """
    result = await db.sale_records.insert_one(data)
    record = await db.sale_records.find_one({"_id": result.inserted_id})
    record["_id"] = str(record["_id"])
    return record


async def get_sales_by_serial(serial_number: str) -> list[dict]:
    """
    Fetch all sale records for a single device, sorted newest first.
    Returns an empty list if no records exist.
    """
    cursor = db.sale_records.find({"serial_number": serial_number}).sort(
        "sold_at", -1
    )
    records = await cursor.to_list(length=None)
    for r in records:
        r["_id"] = str(r["_id"])
    return records


async def get_sale_by_serial(serial_number: str) -> dict | None:
    """
    Backwards-compat helper used by analytics worker.
    Returns the most recent sale record for a device, or None.
    """
    records = await get_sales_by_serial(serial_number)
    return records[0] if records else None


async def update_sale_record(sale_id: str, data: dict) -> dict | None:
    """
    Update a single sale record by its MongoDB _id.
    Returns the updated record, or None if not found.
    """
    await db.sale_records.update_one(
        {"_id": ObjectId(sale_id)},
        {"$set": data},
    )
    record = await db.sale_records.find_one({"_id": ObjectId(sale_id)})
    if record:
        record["_id"] = str(record["_id"])
    return record


async def delete_sale_record(sale_id: str) -> bool:
    """
    Delete a single sale record by its MongoDB _id.
    Returns True if a document was deleted.
    """
    result = await db.sale_records.delete_one({"_id": ObjectId(sale_id)})
    return result.deleted_count > 0


async def get_sales_summary() -> dict:
    """
    Fleet-level aggregation: total revenue, devices at risk, breakdown by region and channel.
    Joins sale_records with device_analytics to surface financial risk.
    Works correctly with multiple sale records per twin.
    """
    # Total revenue and per-region / per-channel breakdown from sale_records
    revenue_pipeline = [
        {
            "$group": {
                "_id": None,
                "total_revenue": {"$sum": "$price_usd"},
                "total_units": {"$sum": 1},
            }
        }
    ]
    by_region_pipeline = [
        {
            "$group": {
                "_id": "$region",
                "revenue": {"$sum": "$price_usd"},
                "units": {"$sum": 1},
            }
        },
        {"$sort": {"revenue": -1}},
    ]
    by_channel_pipeline = [
        {
            "$group": {
                "_id": "$channel",
                "revenue": {"$sum": "$price_usd"},
                "units": {"$sum": 1},
            }
        },
        {"$sort": {"revenue": -1}},
    ]

    totals_cursor = db.sale_records.aggregate(revenue_pipeline)
    totals_list = await totals_cursor.to_list(length=1)
    totals = totals_list[0] if totals_list else {"total_revenue": 0.0, "total_units": 0}

    by_region = await db.sale_records.aggregate(by_region_pipeline).to_list(length=100)
    by_channel = await db.sale_records.aggregate(by_channel_pipeline).to_list(
        length=100
    )

    # Devices at risk: analytics records where return_risk_flag is True
    at_risk_count = await db.device_analytics.count_documents(
        {"return_risk_flag": True}
    )

    # Total revenue at risk across fleet
    risk_pipeline = [
        {"$match": {"revenue_at_risk": {"$gt": 0}}},
        {
            "$group": {
                "_id": None,
                "total_revenue_at_risk": {"$sum": "$revenue_at_risk"},
            }
        },
    ]
    risk_cursor = db.device_analytics.aggregate(risk_pipeline)
    risk_list = await risk_cursor.to_list(length=1)
    total_revenue_at_risk = risk_list[0]["total_revenue_at_risk"] if risk_list else 0.0

    return {
        "total_revenue": totals.get("total_revenue", 0.0),
        "total_units_sold": totals.get("total_units", 0),
        "total_revenue_at_risk": round(total_revenue_at_risk, 2),
        "devices_at_risk": at_risk_count,
        "by_region": [
            {"region": r["_id"], "revenue": r["revenue"], "units": r["units"]}
            for r in by_region
        ],
        "by_channel": [
            {"channel": c["_id"], "revenue": c["revenue"], "units": c["units"]}
            for c in by_channel
        ],
    }
