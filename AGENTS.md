# AI Agents Operational Guidelines

To maintain the high standard of the **Apple Digital Twin project**, all AI agents must adhere to the following rules.

## 🏗️ Architecture & Patterns

- **Clean Architecture**: Keep business logic (services) separate from transport layers (routes/WebSockets).
- **SOLID Principles**: Especially Single Responsibility. Consumers should be pure observers; simulators should be pure providers.
- **Persistent Connections**: Avoid "Connect-Per-Request" for RabbitMQ. Use the singleton pattern in `services/rabbitmq.py`.

## 🎨 Design & UX (Apple Aesthetics)

- **Colors**: No generic CSS colors. Use HSL-tuned Apple palettes (`#0071e3` for accent, `#f5f5f7` for background).
- **Responsiveness**: Use glassmorphism (`backdrop-filter`) for all modals and overlays.
- **Micro-interactions**: Use `animate-pulse` or `transition` for any state change.
- **Data Flow**: Real-time hardware telemetry MUST be pushed via Socket.IO, never polled.

## 📡 Message Protocol

- **Telemetry**: Sent via `telemetry_updates` queue. Frequency should balance "live feel" with server load (0.5Hz suggested).
- **Commands**: Sent via `device_commands` queue. Format: `{"target_serial": str, "action": str}`.

## 🛠️ Tech Stack Enforcement

- **Frontend**: Qwik City + Tailwind (Layout) + Vanilla CSS (Apple styling tokens).
- **Backend**: FastAPI + Socket.IO + Motor.
- **Messaging**: RabbitMQ.
- **Linting**: **Ruff** for Backend (formatting, linting, import sorting); **ESLint/Prettier** for Frontend.

## 📝 Commits & Documentation

- **Clear Summaries**: Every tool call should explain _why_ a change is happening, not just _what_.
- **README First**: Update the `README.md` mermaid diagrams if the networking flow changes.
