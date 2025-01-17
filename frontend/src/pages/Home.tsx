import { useEffect, useState } from "react";
import { NoteCard } from "../components/NoteCard";
import { fetchContent, deleteContent, editContent } from "../services/api";
import { useOutletContext } from "react-router-dom";

interface Content {
  id: string;
  title: string;
  type: "document" | "tweet" | "video" | "image" | "article" | "audio";
  tags: string[];
  date: string;
  link: string;
  content?: string;
  createdAt?: string; // Add this field
}
type ContextType = {
  setRefresh: (prev: number) => void;
  refresh: number;
};

export function Home() {
  const [content, setContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refresh, setRefresh } = useOutletContext<ContextType>();

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetchContent();
        console.log("Raw API response:", response);

        // Handle different response structures
        const contentData = Array.isArray(response)
          ? response
          : response.content || response.data || [];

        setContent(
          contentData.map((item: any) => ({
            id: item.id || item._id,
            title: item.title,
            type: item.type,
            tags: item.tags || [],
            date: item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }),
            link: item.link || item.url,
            content: item.content || item.description,
          }))
        );
      } catch (err) {
        console.error("Content loading error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load content. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [refresh]);

  const handleDelete = async (id: string) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!userConfirmed) return;

    try {
      await deleteContent(id);
      setContent((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting content:", err);
      alert("Failed to delete content. Please try again.");
    }
  };

  const handleEdit = async (
    id: string,
    newData: {
      title: string;
      type: "document" | "tweet" | "video" | "image" | "article" | "audio";
      link: string;
      tags: string[];
    }
  ) => {
    try {
      await editContent(id, newData);
      setContent((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...newData,
              }
            : item
        )
      );
    } catch (err) {
      console.error("Error editing content:", err);
      alert("Failed to edit content. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {content.map((item) => (
          <NoteCard
            key={item.id}
            id={item.id}
            title={item.title}
            type={item.type}
            tags={item.tags}
            date={item.date}
            link={item.link}
            content={item.content}
            onDelete={() => handleDelete(item.id)}
            onEdit={(newData) => handleEdit(item.id, newData)}
          />
        ))}
      </div>
    </div>
  );
}
