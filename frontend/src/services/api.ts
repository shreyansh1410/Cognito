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

// export const fetchContent = async () => {
//   try {
//     const response = await api.get("/content");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching content:", error);
//     throw error;
//   }
// };

// services/api.ts
export async function fetchContent() {
  // Simulating a backend API call
  return Promise.resolve([
    {
      id: "1",
      type: "image",
      title: "Beautiful Sunset",
      tags: ["nature", "sunset", "photography"],
      date: "2025-01-14",
      link: "https://example.com/sample-image.jpg",
    },
    {
      id: "2",
      type: "video",
      title: "How to Organize Your Second Brain",
      tags: ["tutorial", "self-improvement"],
      date: "2025-01-13",
      link: "https://example.com/sample-video.mp4",
    },
    {
      id: "3",
      type: "article",
      title: "The Ultimate Guide to Productivity",
      tags: ["productivity", "guide", "organization"],
      date: "2025-01-12",
      link: "https://example.com/blog-post",
    },
    {
      id: "4",
      type: "audio",
      title: "Relaxing Piano Music",
      tags: ["music", "relaxation"],
      date: "2025-01-11",
      link: "https://example.com/sample-audio.mp3",
    },
  ]);
}

export default api;
