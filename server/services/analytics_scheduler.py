import asyncio
from database import db
from services.rabbitmq import publish_analytics_job

async def analytics_scheduler_loop():
    """
    Periodically fetches all active devices and queues them for analysis.
    """
    print("⏰ Starting Analytics Scheduler (Interval: 60s)...")
    
    try:
        while True:
            # 1. Get all active serial numbers
            cursor = db.twins.find({}, {"serial_number": 1})
            serials = [doc["serial_number"] async for doc in cursor]

            if serials:
                # print(f"Queueing analysis for {len(serials)} devices...")
                for serial in serials:
                    await publish_analytics_job(serial)
            
            # Wait for next cycle (e.g., every 60 seconds)
            await asyncio.sleep(60)

    except asyncio.CancelledError:
        print("Analytics scheduler stopped.")
    except Exception as e:
        print(f"Analytics Scheduler Error: {e}")
