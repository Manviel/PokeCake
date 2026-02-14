import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
import os
import random
import json
import asyncio

import aio_pika
from database import db

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_USER = os.getenv("RABBITMQ_DEFAULT_USER", "user")
RABBITMQ_PASS = os.getenv("RABBITMQ_DEFAULT_PASS", "password")
RABBITMQ_URL = f"amqp://{RABBITMQ_USER}:{RABBITMQ_PASS}@{RABBITMQ_HOST}:5672/"


class SimulationModel:
    """
    Physics-based model for device simulation trained on synthetic data.
    Uses scikit-learn to learn relationships between CPU load, Temperature, and Battery.
    """
    _instance = None
    _is_trained = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SimulationModel, cls).__new__(cls)
            cls._instance.temp_model = LinearRegression()
            cls._instance.battery_model = LinearRegression()
            cls._instance.train()
        return cls._instance

    def train(self):
        if self._is_trained:
            return

        print("🧠 Training Physics Simulation Models...")
        # Synthetic Data Generation
        n_samples = 1000
        
        # Features: CPU Load (0-100), Current Temp (20-90)
        X_cpu = np.random.uniform(0, 100, n_samples)
        X_temp = np.random.uniform(20, 90, n_samples)
        
        # Target Physics Laws (Approximation)
        # 1. Temperature approaches a steady state based on CPU load
        # steady_state_temp = 30 + (CPU / 100) * 50  (Max ~80C)
        # delta_temp = k * (steady_state - current_temp)
        steady_state_temp = 30 + (X_cpu / 100.0) * 50
        y_temp_delta = 0.1 * (steady_state_temp - X_temp) + np.random.normal(0, 0.5, n_samples)
        
        # 2. Battery Drain depends on CPU and Temp (higher temp = slightly faster drain)
        # drain = base + cpu_factor + temp_loss
        y_battery_delta = -(0.01 + (X_cpu / 1000.0) * 0.5 + (X_temp / 100.0) * 0.05) + np.random.normal(0, 0.001, n_samples)

        # Prepare DataFrame for Training
        df = pd.DataFrame({
            'cpu': X_cpu,
            'temp': X_temp,
            'target_temp_delta': y_temp_delta,
            'target_battery_delta': y_battery_delta
        })

        # Train Scikit-Learn Models
        self.temp_model.fit(df[['cpu', 'temp']], df['target_temp_delta'])
        self.battery_model.fit(df[['cpu', 'temp']], df['target_battery_delta'])
        
        self._is_trained = True
        print("✅ Models Trained.")

    def predict(self, current_state: pd.DataFrame):
        """
        Predicts deltas for user state.
        Expects DataFrame with columns: ['cpu', 'temp']
        """
        temp_delta = self.temp_model.predict(current_state[['cpu', 'temp']])
        battery_delta = self.battery_model.predict(current_state[['cpu', 'temp']])
        
        return temp_delta, battery_delta


class DeviceSimulator:
    def __init__(self, serial_number):
        self.serial_number = serial_number
        self.model = SimulationModel()
        
        # Initial State
        self.state = pd.DataFrame([{
            'cpu': 0.0,
            'temp': 25.0,
            'battery': float(random.randint(40, 90)),
            'charging': 0.0  # 0 or 1
        }])
        
        self.active_ticks_remaining = 0

    def trigger_diagnostics(self):
        self.active_ticks_remaining = 10
        # Force high CPU usage in next update by setting state
        self.state.loc[0, 'cpu'] = 95.0

    def update(self):
        # 1. Determine Next CPU State (Random Walk or Diagnostics override)
        current_cpu = self.state.loc[0, 'cpu']
        
        if self.active_ticks_remaining > 0:
            target_cpu = 95.0
            self.active_ticks_remaining -= 1
        else:
            # Idle/Normal behavior: Target low CPU (idle state)
            # Most of the time, the device should be idling (0-5% CPU)
            target_cpu = np.random.uniform(0.0, 5.0)
            
            # Random User Activity (Spikes/Usage)
            # 10% chance to be in "active usage" mode (10-40% CPU)
            if random.random() < 0.10:
                target_cpu = np.random.uniform(10.0, 40.0)
            
            # Rare heavy spikes (1% chance)
            if random.random() < 0.01:
                target_cpu = np.random.uniform(60.0, 90.0)

        # Smooth CPU transition (pandas ewm equivalent mostly, but simple linear interpolation here for step)
        next_cpu = 0.7 * current_cpu + 0.3 * target_cpu
        self.state.loc[0, 'cpu'] = next_cpu

        # 2. Predict Physics (Temp & Battery) using ML Model
        # Input features: [cpu, temp]
        current_temp = self.state.loc[0, 'temp']
        
        # Predict deltas
        temp_delta, battery_delta = self.model.predict(self.state[['cpu', 'temp']])
        
        # Apply deltas
        self.state.loc[0, 'temp'] = np.clip(current_temp + temp_delta[0], 20.0, 100.0)
        
        # Handle Charging Logic
        is_charging = self.state.loc[0, 'charging'] > 0.5
        current_battery = self.state.loc[0, 'battery']
        
        if is_charging:
             self.state.loc[0, 'battery'] = min(100.0, current_battery + 0.5)
             if self.state.loc[0, 'battery'] >= 100:
                 self.state.loc[0, 'charging'] = 0.0
        else:
             self.state.loc[0, 'battery'] = max(0.0, current_battery + battery_delta[0])
             # Auto-charge if too low
             if self.state.loc[0, 'battery'] < 10.0:
                 self.state.loc[0, 'charging'] = 1.0



        return {
            "serial_number": self.serial_number,
            "cpu_usage": int(self.state.loc[0, 'cpu']),
            "temperature": round(float(self.state.loc[0, 'temp']), 1),
            "battery_health": int(self.state.loc[0, 'battery']),
            "is_charging": bool(self.state.loc[0, 'charging'] > 0.5),
        }


async def run_simulation():
    """Simulator background task."""
    print("🚀 Starting Device Simulation Task...")

    connection = None
    try:
        connection = await aio_pika.connect_robust(RABBITMQ_URL)
        channel = await connection.channel()
        exchange = channel.default_exchange

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
            cursor = db.twins.find({}, {"serial_number": 1})
            db_serials = [doc["serial_number"] async for doc in cursor]

            for s in db_serials:
                if s not in simulators:
                    simulators[s] = DeviceSimulator(s)

            # Remove simulators for deleted twins to prevent memory leak
            for s in list(simulators.keys()):
                if s not in db_serials:
                    del simulators[s]

            for serial, sim in simulators.items():
                data = sim.update()
                if data:
                    await exchange.publish(
                        aio_pika.Message(body=json.dumps(data).encode()),
                        routing_key="telemetry_updates",
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
