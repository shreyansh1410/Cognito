import axios from "axios";

const API_BASE_URL = `${process.env.BASE_URL}/api/v1` ||  "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchContent = async () => {
  try {
    const response = await api.get("/content");
    return response.data;
  } catch (error) {
    console.error("Error fetching content:", error);
    throw error;
  }
};

export default api;
