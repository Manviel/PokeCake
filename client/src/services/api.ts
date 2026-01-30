export interface ProductTwin {
  _id: string;
  name: string;
  model_identifier: string;
  serial_number: string;
  os_version: string;
  battery_health: number;
  warranty_status: string;
  last_synced: string;
}

const API_BASE = "http://localhost:8000/api/v1";

export const fetchTwins = async (): Promise<ProductTwin[]> => {
  const response = await fetch(`${API_BASE}/twins`);
  if (!response.ok) {
    throw new Error("Failed to fetch twins");
  }
  return response.json();
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
  // Let the API handle the generation of serials, model identifiers, etc.
  // This follows real business logic where the server registers the hardware.
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
