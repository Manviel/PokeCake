import { API_BASE } from "./client";

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
  revenue_at_risk: number | null;
  return_risk_flag: boolean | null;
  days_since_sale: number | null;
}

export const fetchHistory = async (serial: string): Promise<HistoryItem[]> => {
  const response = await fetch(`${API_BASE}/analytics/${serial}/history`);
  if (!response.ok) return [];
  return response.json();
};

export const fetchForecast = async (
  serial: string,
): Promise<Forecast | null> => {
  const response = await fetch(`${API_BASE}/analytics/${serial}/forecast`);
  if (!response.ok) return null;
  return response.json();
};

export const fetchAnomalies = async (serial: string): Promise<Anomaly[]> => {
  const response = await fetch(`${API_BASE}/analytics/${serial}/anomalies`);
  if (!response.ok) return [];
  return response.json();
};

export const fetchDeviceAnalytics = async (
  serial: string,
): Promise<DeviceAnalytics> => {
  const response = await fetch(`${API_BASE}/analytics/${serial}/overview`);
  if (!response.ok) {
    console.warn("Analytics not found, returning default.");
    return {
      serial_number: serial,
      last_analyzed: new Date().toISOString(),
      health_score: 100,
      predicted_failure_date: null,
      anomalies: [],
      usage_trend: UsageTrend.STABLE,
      revenue_at_risk: null,
      return_risk_flag: null,
      days_since_sale: null,
    };
  }
  return response.json();
};
