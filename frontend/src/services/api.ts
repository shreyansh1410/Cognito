import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1";

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
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching content:", error);
    throw error;
  }
};

export const deleteContent = async (id: string) => {
  const response = await axios.delete(`/api/content`, {
    data: { contentId: id },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const editContent = async (
  contentId: string,
  data: {
    title: string;
    type: "image" | "video" | "article" | "audio";
    link: string;
    tags: string[];
  }
) => {
  const response = await api.put("/content/edit", {
    contentId,
    ...data,
  });
  return response.data;
};

export default api;
