import { API_BASE } from "./client";

export interface SaleRecord {
  _id: string;
  serial_number: string;
  price_usd: number;
  region: "US" | "EU" | "APAC" | "LATAM";
  channel: "online" | "retail" | "B2B";
  customer_segment: "consumer" | "enterprise" | "education";
  sold_at: string;
}

export interface SalesSummary {
  total_revenue: number;
  total_units_sold: number;
  total_revenue_at_risk: number;
  devices_at_risk: number;
  by_region: { region: string; revenue: number; units: number }[];
  by_channel: { channel: string; revenue: number; units: number }[];
}

export const fetchSaleRecords = async (
  serial: string,
): Promise<SaleRecord[]> => {
  const response = await fetch(`${API_BASE}/sales/${serial}`);
  if (!response.ok) return [];
  return response.json();
};

export const fetchSalesSummary = async (): Promise<SalesSummary> => {
  const response = await fetch(`${API_BASE}/sales/summary`);
  if (!response.ok)
    return {
      total_revenue: 0,
      total_units_sold: 0,
      total_revenue_at_risk: 0,
      devices_at_risk: 0,
      by_region: [],
      by_channel: [],
    };
  return response.json();
};

export const recordSale = async (
  data: Omit<SaleRecord, "_id">,
): Promise<SaleRecord> => {
  const response = await fetch(`${API_BASE}/sales`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to record sale");
  return response.json();
};

export const updateSaleRecord = async (
  serial: string,
  saleId: string,
  data: Omit<SaleRecord, "_id">,
): Promise<SaleRecord> => {
  const response = await fetch(`${API_BASE}/sales/${serial}/${saleId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update sale");
  return response.json();
};

export const deleteSaleRecord = async (
  serial: string,
  saleId: string,
): Promise<void> => {
  const response = await fetch(`${API_BASE}/sales/${serial}/${saleId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete sale");
};
