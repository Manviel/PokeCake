import { io, Socket } from "socket.io-client";
import { getSocketUrl } from "./api";
import type { ProductTwin } from "./api";

/**
 * Socket.IO service for real-time telemetry updates
 * Follows Clean Architecture: separates transport layer from business logic
 */

export type TelemetryUpdateCallback = (
  data: Partial<ProductTwin> & { _id: string },
) => void;

export class SocketService {
  private socket: Socket | null = null;
  private telemetryCallback: TelemetryUpdateCallback | null = null;

  /**
   * Initialize and connect to the Socket.IO server
   */
  connect(): void {
    if (this.socket?.connected) {
      console.warn("Socket already connected");
      return;
    }

    this.socket = io(getSocketUrl(), {
      transports: ["websocket"], // Force WebSocket to avoid polling issues
    });

    this.socket.on("connect", () => {
      console.log("Connected to Real-time Twin Stream");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from Real-time Twin Stream");
    });

    this.socket.on("telemetry_update", (data) => {
      if (this.telemetryCallback) {
        this.telemetryCallback(data);
      }
    });
  }

  /**
   * Register a callback for telemetry updates
   */
  onTelemetryUpdate(callback: TelemetryUpdateCallback): void {
    this.telemetryCallback = callback;
  }

  /**
   * Disconnect from the Socket.IO server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.telemetryCallback = null;
    }
  }

  /**
   * Check if the socket is currently connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

// Singleton instance for the application
export const socketService = new SocketService();
