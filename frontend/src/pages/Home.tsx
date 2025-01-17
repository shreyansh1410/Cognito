import { act, useEffect, useState } from "react";
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
  createdAt?: string;
}

type ContextType = {
  setRefresh: (prev: number) => void;
  refresh: number;
  activeFilter: string;
};

export function Home() {
  const [content, setContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refresh, setRefresh, activeFilter } = useOutletContext<ContextType>();

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetchContent();
        const contentData = Array.isArray(response)
          ? response
          : response.content || response.data || [];

        const formattedContent = contentData.map((item: any) => ({
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
        }));

        setContent(formattedContent);
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

  const getFilteredContent = () => {
    if (activeFilter === "all") return content;
    if (activeFilter === "document")
      return content.filter((item) => item.type === "document");
    if (activeFilter === "tweet")
      return content.filter((item) => item.type === "tweet");
    if (activeFilter === "video")
      return content.filter((item) => item.type === "video");
    if (activeFilter === "tags")
      return content.filter((item) => item.tags && item.tags.length > 0);
    if (activeFilter === "image")
      return content.filter((item) => item.type === "image");
    return content;
  };

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

  const filteredContent = getFilteredContent();

  return (
    <div className="p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredContent.map((item) => (
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
      {filteredContent.length === 0 && (
        <div className="text-center mt-8 text-gray-500">
          No content found for this category.
        </div>
      )}
    </div>
  );
}
