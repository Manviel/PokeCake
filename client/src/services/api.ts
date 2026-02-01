export interface ProductTwin {
  _id: string;
  name: string;
  model_identifier: string;
  serial_number: string;
  os_version: string;
  battery_health: number;
  cpu_usage: number;
  temperature: number;
  is_charging: boolean;
  last_synced: string;
}

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Browser
    return import.meta.env.VITE_API_URL + "/api/v1";
  }

  // Server (SSR)
  // When running locally, localhost works. 
  // When running in Docker, we set VITE_INTERNAL_API_URL to 'http://api:8000'
  return import.meta.env.VITE_INTERNAL_API_URL + "/api/v1";
};

export const getSocketUrl = () => {
    if (typeof window !== "undefined") {
        return import.meta.env.VITE_API_URL || "http://localhost:8000";
    }
    return "http://localhost:8000";
}

const API_BASE = getBaseUrl();

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
