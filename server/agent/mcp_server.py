import json

from bson import ObjectId
from mcp.server.fastmcp import FastMCP

from database import get_database

# Define the FastMCP server
mcp = FastMCP("AppleDigitalTwinMCP")


@mcp.tool()
async def get_digital_twin(twin_id: str) -> str:
    """
    Fetch the latest telemetry and status for a specific Apple digital twin by its ID.
    Args:
        twin_id: The unique identifier of the twin (serial_number or MongoDB _id)
    """
    db = await get_database()
    twin = await db.twins.find_one({"serial_number": twin_id})
    if not twin and ObjectId.is_valid(twin_id):
        twin = await db.twins.find_one({"_id": ObjectId(twin_id)})

    if twin:
        return json.dumps(twin, default=str)
    return json.dumps({"error": f"Twin {twin_id} not found."})


@mcp.tool()
async def get_all_active_twins() -> str:
    """
    Fetch all active digital twins currently transmitting telemetry.
    """
    db = await get_database()
    cursor = db.twins.find()
    twins = await cursor.to_list(length=100)

    # Organize as a dictionary keyed by serial_number to match the expected format
    active = {doc.get("serial_number", str(doc["_id"])): doc for doc in twins}
    return json.dumps(active, default=str)


@mcp.tool()
async def get_sales_data(region: str = None) -> str:
    """
    Fetch sales records for digital twins. Optionally filter by region.
    Args:
        region: The geographical region (e.g., 'US', 'EU'). Optional.
    """
    db = await get_database()
    query = {"region": region} if region else {}
    cursor = db.sale_records.find(query)
    sales = await cursor.to_list(length=100)
    return json.dumps(sales, default=str)


if __name__ == "__main__":
    # In a real app, this would attach to stdio or SSE
    mcp.run(transport="stdio")
