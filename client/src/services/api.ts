export interface ProductTwin {
  _id: string;
  name: string;
  serial_number: string;
  os_version: string;
  battery_health: number;
  cpu_usage: number;
  temperature: number;
  is_charging: boolean;
  last_synced: string;
}

export const getSocketUrl = () => {
  if (typeof window !== "undefined") {
    return import.meta.env.VITE_API_URL || "http://localhost:8000";
  }
  return "http://localhost:8000";
};

const API_BASE =
  typeof window !== "undefined"
    ? `${import.meta.env.VITE_API_URL}/api/v1`
    : `${import.meta.env.VITE_INTERNAL_API_URL}/api/v1`;

export const fetchTwins = async (): Promise<ProductTwin[]> => {
  const response = await fetch(`${API_BASE}/twins`);
  if (!response.ok) {
    throw new Error("Failed to fetch twins");
  }
  return response.json();
};

export const updateTwin = async (
  id: string,
  updates: Partial<ProductTwin>,
): Promise<void> => {
  const response = await fetch(`${API_BASE}/twins/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update twin");
  }
};

export const updateTwinOs = async (
  id: string,
  osVersion: string,
): Promise<void> => {
  const response = await fetch(`${API_BASE}/twins/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ os_version: osVersion }),
  });

  if (!response.ok) {
    throw new Error("Failed to update OS");
  }
};

export const pairNewDevice = async (): Promise<void> => {
  const response = await fetch(`${API_BASE}/twins`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "iPhone 15 Pro",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to pair device");
  }
};

export const unpairDevice = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/twins/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to unpair device");
  }
};

export const runDiagnostics = async (
  id: string,
): Promise<{ healthy: boolean; message: string }> => {
  const response = await fetch(`${API_BASE}/twins/${id}/diagnostics`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Diagnostics failed");
  }
  return response.json();
};

export const fetchHistory = async (serial: string): Promise<HistoryItem[]> => {
  const response = await fetch(`${API_BASE}/analytics/${serial}/history`);
  if (!response.ok) return [];
  return response.json();
};

export const fetchForecast = async (serial: string): Promise<Forecast | null> => {
  const response = await fetch(`${API_BASE}/analytics/${serial}/forecast`);
  if (!response.ok) return null;
  return response.json();
};

export const fetchAnomalies = async (serial: string): Promise<Anomaly[]> => {
  const response = await fetch(`${API_BASE}/analytics/${serial}/anomalies`);
  if (!response.ok) return [];
  return response.json();
};

export interface HistoryItem {
  last_synced: string;
  temperature: number;
  cpu_usage: number;
}

export interface Forecast {
  current_temperature: number;
  forecast_temperature: number;
  trend: string;
}

export enum UsageTrend {
  INCREASING = "increasing",
  DECREASING = "decreasing",
  STABLE = "stable",
}

export interface Anomaly {
  timestamp: string;
  type: string;
  temperature: number;
}

export interface DeviceAnalytics {
  serial_number: string;
  last_analyzed: string;
  health_score: number;
  predicted_failure_date: string | null;
  anomalies: Anomaly[];
  usage_trend: UsageTrend;
}

export const fetchDeviceAnalytics = async (
  serial: string,
): Promise<DeviceAnalytics> => {
  const response = await fetch(`${API_BASE}/analytics/${serial}/overview`);
  if (!response.ok) {
    // If 404 or other error, return default structure to avoid UI break
    console.warn("Analytics not found, returning default.");
    return {
      serial_number: serial,
      last_analyzed: new Date().toISOString(),
      health_score: 100,
      predicted_failure_date: null,
      anomalies: [],
      usage_trend: UsageTrend.STABLE,
    };
  }
  return response.json();
};
