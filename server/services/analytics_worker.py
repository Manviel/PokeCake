import asyncio
import json
import logging
from datetime import datetime

import aio_pika

from database import db
from services.analytics import detect_anomalies, train_model_and_forecast
from services.rabbitmq import ANALYTICS_QUEUE, get_rabbitmq
from services.sales import get_sale_by_serial

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

                # 1. Run telemetry analysis
                anomalies = await detect_anomalies(serial_number)
                forecast = await train_model_and_forecast(serial_number)

                # 2. Calculate Health Score
                twin = await db.twins.find_one({"serial_number": serial_number})
                battery_health = twin.get("battery_health", 100) if twin else 100
                health_score = max(0, min(100, battery_health - len(anomalies) * 5))

                # 3. Determine Usage Trend
                trend = (
                    forecast.get("trend", "stable")
                    if forecast and "trend" in forecast
                    else "stable"
                )

                # 4. Join SaleRecord to derive financial risk metrics
                now = datetime.utcnow()
                sale = await get_sale_by_serial(serial_number)
                if sale:
                    days_since_sale = (now - sale["sold_at"]).days
                    revenue_at_risk = round(
                        sale["price_usd"] * (1 - health_score / 100), 2
                    )
                    return_risk_flag = health_score < 40 and days_since_sale < 365
                else:
                    days_since_sale = None
                    revenue_at_risk = None
                    return_risk_flag = None

                # 5. Persist enriched analytics record
                analytics_record = {
                    "serial_number": serial_number,
                    "last_analyzed": now,
                    "health_score": int(health_score),
                    "predicted_failure_date": None,
                    "anomalies": anomalies,
                    "usage_trend": trend,
                    "revenue_at_risk": revenue_at_risk,
                    "return_risk_flag": return_risk_flag,
                    "days_since_sale": days_since_sale,
                }

                await db.device_analytics.update_one(
                    {"serial_number": serial_number},
                    {"$set": analytics_record},
                    upsert=True,
                )

            except Exception as e:
                logger.error(f"Error processing analytics job: {e}")

    async def run(self):
        print("🧠 Starting Analytics Worker...")
        self.running = True

        while self.running:
            try:
                _, channel = await get_rabbitmq()
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
