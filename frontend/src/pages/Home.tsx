import { useEffect, useState } from "react";
import { NoteCard } from "../components/NoteCard";
import { fetchContent, deleteContent, editContent } from "../services/api";

interface Content {
  id: string;
  title: string;
  type: "image" | "video" | "article" | "audio";
  tags: string[];
  date: string;
  link: string;
}

export function Home() {
  const [content, setContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetchContent();

        console.log("Raw API response:", response);

        if (
          response &&
          typeof response === "object" &&
          Array.isArray(response.content)
        ) {
          setContent(response.content);
        } else {
          throw new Error("Unexpected API response structure.");
        }
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
  }, []);

  const handleDelete = async (id: string) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!userConfirmed) return;

    try {
      await deleteContent(id); // API call to delete content
      setContent((prev) => prev.filter((item) => item.id !== id)); // Update UI
    } catch (err) {
      console.error("Error deleting content:", err);
      alert("Failed to delete content. Please try again.");
    }
  };
  const handleEdit = async (
    id: string,
    newData: {
      title: string;
      type: "image" | "video" | "article" | "audio";
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
          content={`Link: ${item.link}`}
          onDelete={() => handleDelete(item.id)}
          onEdit={(newData) => handleEdit(item.id, newData)}
        />
      ))}
    </div>
  );
}
