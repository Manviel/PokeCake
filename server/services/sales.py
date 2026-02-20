from database import db


async def create_sale_record(data: dict) -> dict:
    """
    Upsert a sale record for a device. One record per serial number.
    """
    await db.sale_records.update_one(
        {"serial_number": data["serial_number"]},
        {"$set": data},
        upsert=True,
    )
    record = await db.sale_records.find_one({"serial_number": data["serial_number"]})
    record["_id"] = str(record["_id"])
    return record


async def get_sale_by_serial(serial_number: str) -> dict | None:
    """
    Fetch the sale record for a single device, or None if not sold yet.
    """
    record = await db.sale_records.find_one({"serial_number": serial_number})
    if record:
        record["_id"] = str(record["_id"])
    return record


async def get_sales_summary() -> dict:
    """
    Fleet-level aggregation: total revenue, devices at risk, breakdown by region and channel.
    Joins sale_records with device_analytics to surface financial risk.
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
