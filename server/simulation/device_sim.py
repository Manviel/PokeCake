import asyncio
import os
import random
import json
import math
from datetime import datetime
from database import db
import aio_pika

# Config
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_USER = os.getenv("RABBITMQ_DEFAULT_USER", "user")
RABBITMQ_PASS = os.getenv("RABBITMQ_DEFAULT_PASS", "password")
RABBITMQ_URL = f"amqp://{RABBITMQ_USER}:{RABBITMQ_PASS}@{RABBITMQ_HOST}:5672/"

class DeviceSimulator:
    def __init__(self, serial_number):
        self.serial_number = serial_number
        self.battery = random.randint(40, 90)
        self.temp = 25.0
        self.cpu = 0
        self.charging = False
        self.tick = 0
        self.active_ticks_remaining = 0 

    def trigger_diagnostics(self):
        # 10s Burst (5 ticks) + 10s Cooldown (5 ticks) = 10 ticks total @ 0.5Hz
        self.active_ticks_remaining = 10
        self.cpu = 95 

    def update(self):
        if self.active_ticks_remaining <= 0:
            # When stopping, we ensure CPU is 0 and Temp is settling
            self.cpu = 0
            return None 

        self.tick += 1
        self.active_ticks_remaining -= 1
        
        # Phase 1: Heavy Load (The first 5 ticks / 10 seconds)
        if self.active_ticks_remaining >= 5:
            self.cpu = random.randint(85, 100)
            self.temp = min(85.0, self.temp + random.uniform(3.0, 7.0))
            self.battery = max(0, self.battery - random.uniform(0.5, 1.0))
        
        # Phase 2: Cooldown (The last 5 ticks / 10 seconds)
        else:
            # Rapidly decrease CPU to 0
            self.cpu = max(0, self.cpu - random.randint(20, 30))
            # Slowly decrease temp
            self.temp = max(25.0, self.temp - random.uniform(2.0, 4.0))
            # Normal battery drain
            self.battery = max(0, self.battery - 0.1)
        
        return {
            "serial_number": self.serial_number,
            "cpu_usage": int(self.cpu),
            "temperature": round(self.temp, 1),
            "battery_health": int(self.battery), 
            "is_charging": self.charging
        }

async def run_simulation():
    """Simulator background task."""
    print("🚀 Starting Device Simulation Task...")
    
    connection = None
    try:
        connection = await aio_pika.connect_robust(RABBITMQ_URL)
        channel = await connection.channel()
        exchange = channel.default_exchange
        
        # Command Queue
        command_queue = await channel.declare_queue("device_commands", durable=True)
        
        simulators = {}

        async def on_command(message: aio_pika.IncomingMessage):
            async with message.process():
                try:
                    payload = json.loads(message.body)
                    serial = payload.get("target_serial")
                    action = payload.get("action")
                    
                    if serial in simulators:
                        print(f" [!] Stimulating Hardware for {serial}: {action}")
                        if action == "RUN_DIAGNOSTICS":
                            simulators[serial].trigger_diagnostics()
                except Exception as e:
                    print(f"Error handling command in simulator: {e}")

        await command_queue.consume(on_command)

        while True:
            # Refresh simulators periodically from DB
            cursor = db.twins.find({}, {"serial_number": 1})
            db_serials = [doc["serial_number"] async for doc in cursor]
            
            for s in db_serials:
                if s not in simulators:
                    simulators[s] = DeviceSimulator(s)
            
            # Tick and Publish
            for serial, sim in simulators.items():
                data = sim.update()
                if data:
                    await exchange.publish(
                        aio_pika.Message(body=json.dumps(data).encode()),
                        routing_key="telemetry_updates"
                    )
            
            await asyncio.sleep(2) 
            
    except asyncio.CancelledError:
        print("Simulation task stopped.")
    except Exception as e:
        print(f"Simulation Loop Error: {e}")
        await asyncio.sleep(5)
    finally:
        if connection:
            await connection.close()
