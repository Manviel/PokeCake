export const getSocketUrl = () => {
  if (typeof window !== "undefined") {
    return import.meta.env.VITE_API_URL || "http://localhost:8000";
  }
  return "http://localhost:8000";
};

export const API_BASE =
  typeof window !== "undefined"
    ? `${import.meta.env.VITE_API_URL}/api/v1`
    : `${import.meta.env.VITE_INTERNAL_API_URL}/api/v1`;
