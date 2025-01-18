import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1` || "http://localhost:3000/api/v1";

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

export const uploadFile = async (
  file: File,
  onUploadProgress?: (progress: number) => void
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(progress);
        }
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const createContent = async (data: {
  type: string;
  title: string;
  link: string;
  tags: string[];
}) => {
  try {
    const response = await api.post("/content/create", data);
    return response.data;
  } catch (error) {
    console.error("Error creating content:", error);
    throw error;
  }
};

export const fetchContent = async () => {
  try {
    const response = await api.get("/content");
    console.log("Raw API Response:", response);

    return response.data;
  } catch (error) {
    console.error("Error fetching content:", error);
    throw error;
  }
};

export const deleteContent = async (id: string) => {
  try {
    const response = await api.delete(`/content`, {
      data: { contentId: id },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting content:", error);
    throw error;
  }
};

export const editContent = async (
  contentId: string,
  data: {
    title: string;
    type:
      | "document"
      | "tweet"
      | "video"
      | "image"
      | "article"
      | "audio"
      | "link";
    link: string;
    tags: string[];
  }
) => {
  try {
    const response = await api.put("/content/edit", {
      contentId,
      ...data,
    });
    return response.data;
  } catch (error) {
    console.error("Error editing content:", error);
    throw error;
  }
};

export const fetchShareLink = async () => {
  try {
    const response = await api.post("/brain/share", { isShare: true });
    return response.data.shareLink;
  } catch (error) {
    console.error("Error fetching share link:", error);
    throw error;
  }
};

export default api;
