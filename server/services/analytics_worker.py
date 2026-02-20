import asyncio
import json
import logging
from datetime import datetime, timedelta

import aio_pika
from database import db
from services.analytics import detect_anomalies, train_model_and_forecast, get_telemetry_history
from services.rabbitmq import ANALYTICS_QUEUE, get_rabbitmq

logger = logging.getLogger(__name__)

class AnalyticsWorker:
    def __init__(self):
        self.running = False

    async def process_job(self, message: aio_pika.IncomingMessage):
        async with message.process():
            try:
                data = json.loads(message.body)
                serial_number = data.get("serial_number")

                if not serial_number:
                    return

                # 1. Fetch Data
                # history = await get_telemetry_history(serial_number, limit=100) # Used inside functions

                # 2. Run Analysis
                anomalies = await detect_anomalies(serial_number)
                forecast = await train_model_and_forecast(serial_number)

                # 3. Calculate Health Score (Simple Mock Logic)
                # In a real app, this would be a complex weighted sum of various factors.
                # Here: Health = 100 - (High Temp Count * 5) - (Low Battery Penalty)
                
                # Fetch latest twin state for battery
                twin = await db.twins.find_one({"serial_number": serial_number})
                battery_health = twin.get("battery_health", 100) if twin else 100
                
                health_deductions = len(anomalies) * 5
                health_score = max(0, min(100, battery_health - health_deductions))

                # 4. Determine Usage Trend
                trend = "stable"
                if forecast and "trend" in forecast:
                    trend = forecast["trend"]

                # 5. Persist Result
                analytics_record = {
                    "serial_number": serial_number,
                    "last_analyzed": datetime.utcnow(),
                    "health_score": int(health_score),
                    "predicted_failure_date": None, # Placeholder for advanced ML
                    "anomalies": anomalies,
                    "usage_trend": trend
                }

                await db.device_analytics.update_one(
                    {"serial_number": serial_number},
                    {"$set": analytics_record},
                    upsert=True
                )

                # logger.info(f"Analyzed device {serial_number}: Health={health_score}")

            except Exception as e:
                logger.error(f"Error processing analytics job: {e}")

    async def run(self):
        print("🧠 Starting Analytics Worker...")
        self.running = True
        
        while self.running:
            try:
                _, channel = await get_rabbitmq()
                # Prefetch count ensures smooth distribution if multiple workers
                await channel.set_qos(prefetch_count=1) 
                
                queue = await channel.declare_queue(ANALYTICS_QUEUE, durable=True)

                async with queue.iterator() as queue_iter:
                    async for message in queue_iter:
                        await self.process_job(message)
                        
            except asyncio.CancelledError:
                print("Analytics worker cancelled.")
                break
            except Exception as e:
                print(f"Analytics Worker Connection Error: {e}. Retrying in 5s...")
                await asyncio.sleep(5)
