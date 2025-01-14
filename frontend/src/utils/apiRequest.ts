const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const apiRequest = async (
  endpoint: string,
  method: string = "GET",
  body?: any
) => {
  const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
};
