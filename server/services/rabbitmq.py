import asyncio
import json
import os
from datetime import datetime

import aio_pika

from database import db

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_USER = os.getenv("RABBITMQ_DEFAULT_USER", "user")
RABBITMQ_PASS = os.getenv("RABBITMQ_DEFAULT_PASS", "password")
RABBITMQ_URL = f"amqp://{RABBITMQ_USER}:{RABBITMQ_PASS}@{RABBITMQ_HOST}:5672/"

QUEUE_NAME = "telemetry_updates"
COMMANDS_QUEUE = "device_commands"

_connection = None
_channel = None
_lock = asyncio.Lock()


async def get_rabbitmq():
    """Returns a persistent connection and channel."""
    global _connection, _channel
    async with _lock:
        if _connection is None or _connection.is_closed:
            print(f"[*] Connecting to RabbitMQ at {RABBITMQ_HOST}...")
            _connection = await aio_pika.connect_robust(RABBITMQ_URL)
            _channel = None

        if _channel is None or _channel.is_closed:
            _channel = await _connection.channel()
            await _channel.declare_queue(COMMANDS_QUEUE, durable=True)
            await _channel.declare_queue(QUEUE_NAME, durable=True)

        return _connection, _channel


async def publish_command(command: dict):
    """Publishes a command to the commands queue."""
    try:
        _, channel = await get_rabbitmq()
        message_body = json.dumps(command).encode()
        await channel.default_exchange.publish(
            aio_pika.Message(body=message_body), routing_key=COMMANDS_QUEUE
        )
        print(f"Sent command: {command}")
    except Exception as e:
        print(f"Failed to publish command: {e}")


async def process_message(message: aio_pika.IncomingMessage, sio=None):
    async with message.process():
        try:
            data = json.loads(message.body)
            serial_number = data.get("serial_number")

            if not serial_number:
                return

            update_data = {}
            if "cpu_usage" in data:
                update_data["cpu_usage"] = data["cpu_usage"]
            if "temperature" in data:
                update_data["temperature"] = data["temperature"]
            if "battery_health" in data:
                update_data["battery_health"] = data["battery_health"]
            if "is_charging" in data:
                update_data["is_charging"] = data["is_charging"]

            if update_data:
                update_data["last_synced"] = datetime.utcnow()

                await db.twins.update_one(
                    {"serial_number": serial_number}, {"$set": update_data}
                )

                if sio:
                    twin = await db.twins.find_one(
                        {"serial_number": serial_number}, {"_id": 1}
                    )

                    if twin:
                        update_payload = {
                            "_id": str(twin["_id"]),
                            **update_data,
                            "last_synced": str(update_data["last_synced"]),
                        }
                        await sio.emit("telemetry_update", update_payload)
        except Exception as e:
            print(f"Error processing telemetry: {e}")


async def consume_telemetry(sio=None):
    """Consumer loop for telemetry data."""
    print("Starting Telemetry Consumer...")
    while True:
        try:
            _, channel = await get_rabbitmq()
            queue = await channel.declare_queue(QUEUE_NAME, durable=True)

            async with queue.iterator() as queue_iter:
                async for message in queue_iter:
                    await process_message(message, sio)

        except asyncio.CancelledError:
            print("Telemetry consumer cancelled.")
            break
        except Exception as e:
            print(f"Telemetry Consumer Error: {e}. Reconnecting in 5s...")
            await asyncio.sleep(5)
