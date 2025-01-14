import { useEffect, useState } from "react";
import { NoteCard } from "../components/NoteCard";
import { fetchContent } from "../services/api";

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
        const fetchedContent = await fetchContent() as Content[];
        setContent(fetchedContent);
      } catch (err) {
        setError("Failed to load content. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

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
          content={`Link: ${item.link}`}
          onDelete={() => {
            setContent(content.filter((c) => c.id !== item.id));
          }}
        />
      ))}
    </div>
  );
}
